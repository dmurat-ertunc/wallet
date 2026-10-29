import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/constants';

// Backend'e yapılan isteklerde oluşan tüm hatalar bu tipe çevrilir; ekranlar sadece bunu bilmek zorundadır.
export class ApiError extends Error {
  constructor(
    // Kullanıcıya gösterilebilecek hata mesajı
    message: string,
    // HTTP durum kodu (400, 404, 500...); ağ hatası veya zaman aşımında 0
    public readonly status: number,
    // Backend'den gelen alan bazında doğrulama mesajları, ör. { amount: 'must not be null' }
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Kullanılan HTTP metotları
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Oturum açıkken her isteğe eklenen JWT; AuthProvider giriş/çıkışta ve açılışta ayarlar
let authToken: string | null = null;
// Token'lı bir istek 401 dönünce çağrılır (token'ın süresi dolmuş veya geçersiz); AuthProvider oturumu kapatır
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

// Backend'in hata cevaplarının şekli (Spring ProblemDetail, bkz. backend'deki GlobalExceptionHandler)
type ProblemDetail = {
  // Genel hata açıklaması
  detail?: string;
  // Doğrulama hatalarında alan adı → mesaj
  errors?: Record<string, string>;
};

// Başarısız bir HTTP cevabını ApiError'a çevirir
async function toApiError(response: Response): Promise<ApiError> {
  const fallback = `İstek başarısız oldu (${response.status})`;
  try {
    const problem = (await response.json()) as ProblemDetail;
    return new ApiError(problem.detail ?? fallback, response.status, problem.errors ?? {});
  } catch {
    // Cevap gövdesi JSON değilse (ör. boş veya HTML) genel mesajla devam et
    return new ApiError(fallback, response.status);
  }
}

// Tüm HTTP isteklerinin geçtiği tek yer: adres, header'lar, zaman aşımı ve hata işleme burada.
// <T>: cevabın tipi; çağıran taraf belirtir, ör. request<Expense[]>(...)
async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  // AbortController isteği yarıda kesmeye yarar; süre dolunca abort() çağrılır
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  // İstek sürerken çıkış yapılırsa değişebileceği için gönderilen token'ı baştan sabitle
  const token = authToken;

  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
  // Backend'deki JwtAuthenticationFilter bu başlığı okur
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      // GET ve DELETE'te gövde yok; diğerlerinde nesne JSON metnine çevrilir
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    // Token gönderildiği halde 401: oturum geçersiz, kullanıcı giriş ekranına gönderilir.
    // Token'sız 401 (ör. login'de yanlış şifre) oturumla ilgili değildir, normal hata olarak döner.
    if (response.status === 401 && token) {
      unauthorizedHandler?.();
      throw new ApiError('Oturumun sona erdi, lütfen tekrar giriş yap', 401);
    }

    // response.ok: durum kodu 200-299 arasındaysa true
    if (!response.ok) {
      throw await toApiError(response);
    }

    // 204 No Content (ör. silme sonrası) cevabının gövdesi yoktur, çözülecek bir şey yok
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  } catch (e) {
    // Yukarıda kendimiz fırlattığımız ApiError'ı olduğu gibi ilet
    if (e instanceof ApiError) {
      throw e;
    }
    // Zaman aşımı: controller.abort() çağrıldı
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError('Sunucu yanıt vermedi', 0);
    }
    // Diğer her şey: sunucu kapalı, yanlış adres, internet yok...
    throw new ApiError('Sunucuya bağlanılamadı', 0);
  } finally {
    // İstek nasıl biterse bitsin zamanlayıcıyı temizle
    clearTimeout(timeout);
  }
}

// Servislerin kullandığı kısayollar: apiClient.get('/expenses') gibi
export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: (path: string) => request<void>('DELETE', path),
};
