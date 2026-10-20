import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/constants';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Single place where every HTTP call goes through: base URL, headers, timeout and error handling
async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(text || `İstek başarısız oldu (${response.status})`, response.status);
    }

    // 204 No Content (e.g. after DELETE) has no body to parse
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError('Sunucu yanıt vermedi', 0);
    }
    throw new ApiError('Sunucuya bağlanılamadı', 0);
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: (path: string) => request<void>('DELETE', path),
};
