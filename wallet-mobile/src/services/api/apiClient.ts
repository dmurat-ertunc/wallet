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

// İsteğe özel ayarlar
type RequestOptions = {
  // false: access token eklenmez ve 401'de yenileme denenmez (login, register, refresh, logout). Varsayılan true
  auth?: boolean;
};

// Oturum açıkken her isteğe eklenen access token; AuthProvider giriş/çıkışta, açılışta ve yenilemede ayarlar
let authToken: string | null = null;
// Oturum kurtarılamayınca çağrılır (refresh token da geçersiz); AuthProvider oturumu kapatır
let unauthorizedHandler: (() => void) | null = null;
// Access token 401 dönünce çağrılır: refresh token ile yeni token alır ve yeni access token'ı döner.
// Refresh token geçersizse null döner. Ağ hatasında fırlatır; bu durumda oturum kapatılmaz.
let tokenRefresher: (() => Promise<string | null>) | null = null;
// Şu an devam eden yenileme. Aynı anda 401 alan bütün istekler yeni bir yenileme başlatmak yerine bunu bekler.
// Backend refresh token'ı her kullanımda iptal ediyor (rotation); aynı refresh token iki kez gönderilirse
// ikincisini çalıntı sanıp kullanıcının bütün oturumlarını kapatır. Bu yüzden aynı anda tek yenileme olmalı.
let refreshPromise: Promise<string | null> | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export function setTokenRefresher(refresher: (() => Promise<string | null>) | null) {
  tokenRefresher = refresher;
}

// Yenileme devam ediyorsa ona katılır, yoksa yenisini başlatır
function refreshAccessToken(): Promise<string | null> {
  if (!tokenRefresher) {
    return Promise.resolve(null);
  }
  if (!refreshPromise) {
    refreshPromise = tokenRefresher().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Oturum kurtarılamadı: kullanıcı giriş ekranına gönderilir
function sessionExpired(): ApiError {
  unauthorizedHandler?.();
  return new ApiError('Oturumun sona erdi, lütfen tekrar giriş yap', 401);
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

// İsteği tek bir kez gönderir: adres, header'lar ve zaman aşımı burada. Ağ hatalarını ApiError'a çevirir.
async function send(method: HttpMethod, path: string, body: unknown, token: string | null): Promise<Response> {
  // AbortController isteği yarıda kesmeye yarar; süre dolunca abort() çağrılır
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
  // Backend'deki JwtAuthenticationFilter bu başlığı okur
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      // GET ve DELETE'te gövde yok; diğerlerinde nesne JSON metnine çevrilir
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
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

// Tüm HTTP isteklerinin geçtiği tek yer: gönderme, süresi dolan token'ı yenileme ve hata işleme burada.
// <T>: cevabın tipi; çağıran taraf belirtir, ör. request<Expense[]>(...)
async function request<T>(method: HttpMethod, path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  // İstek sürerken token yenilenebileceği veya çıkış yapılabileceği için gönderilen token'ı baştan sabitle
  const token = options.auth === false ? null : authToken;

  let response = await send(method, path, body, token);

  // Token gönderildiği halde 401: access token'ın süresi dolmuş. Kullanıcıya hissettirmeden yenile ve isteği tekrarla.
  // Token'sız 401 (ör. login'de yanlış şifre) oturumla ilgili değildir, aşağıda normal hata olarak döner.
  if (response.status === 401 && token) { // token gönderdim ama 401
    // Bu istek yoldayken başka bir istek token'ı zaten yenilediyse tekrar yenileme, yeni token'la dene
    const newToken = authToken !== token ? authToken : await refreshAccessToken();
    if (!newToken) {
      throw sessionExpired();
    }

    // Sadece bir kez tekrar denenir; yeni token da reddedilirse sonsuz döngüye girmeden oturum kapatılır
    response = await send(method, path, body, newToken);
    if (response.status === 401) {
      throw sessionExpired();
    }
  }

  // response.ok: durum kodu 200-299 arasındaysa true
  if (!response.ok) {
    throw await toApiError(response);
  }

  // 204 No Content (ör. silme sonrası) cevabının gövdesi yoktur, çözülecek bir şey yok
  if (response.status === 204) {
    return undefined as T;
  }
  try {
    return (await response.json()) as T;
  } catch {
    // Gövde okunurken bağlantı koptu veya cevap JSON değil
    throw new ApiError('Sunucuya bağlanılamadı', 0);
  }
}

// Servislerin kullandığı kısayollar: apiClient.get('/expenses') gibi
export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions) => request<T>('POST', path, body, options),
  put: <T>(path: string, body: unknown, options?: RequestOptions) => request<T>('PUT', path, body, options),
  delete: (path: string, options?: RequestOptions) => request<void>('DELETE', path, undefined, options),
};
