import { AuthResponse, LoginRequest, RefreshRequest, RegisterRequest } from '@/models';

import { apiClient } from './api/apiClient';

// Backend'deki AuthController'ın adresi (herkese açık, token gerektirmez)
const BASE_PATH = '/auth';

// Bu uç noktalara access token eklenmez ({ auth: false }). Refresh'e zaten token'ın süresi dolduğu için gidilir;
// ayrıca burada 401 almak "access token'ı yenile" değil "oturum bitti" demektir.
const PUBLIC = { auth: false };

// Giriş, kayıt, token yenileme ve çıkış uç noktaları
export const authService = {
  // POST /api/auth/login → kullanıcı adı ve şifre doğruysa iki token döner, yanlışsa 401
  login: (request: LoginRequest) => apiClient.post<AuthResponse>(`${BASE_PATH}/login`, request, PUBLIC),
  // POST /api/auth/register → yeni kullanıcıyı kaydeder ve hemen iki token döner (ayrıca giriş yapmaya gerek yok).
  // Kullanıcı adı veya e-posta alınmışsa ya da alanlar kurallara uymuyorsa 400
  register: (request: RegisterRequest) => apiClient.post<AuthResponse>(`${BASE_PATH}/register`, request, PUBLIC),
  // POST /api/auth/refresh → refresh token geçerliyse yeni iki token döner (eskisi iptal edilir), değilse 401
  refresh: (request: RefreshRequest) => apiClient.post<AuthResponse>(`${BASE_PATH}/refresh`, request, PUBLIC),
  // POST /api/auth/logout → bu cihazın refresh token'ını iptal eder; token geçersiz olsa bile 204 döner
  logout: (request: RefreshRequest) => apiClient.post<void>(`${BASE_PATH}/logout`, request, PUBLIC),
};
