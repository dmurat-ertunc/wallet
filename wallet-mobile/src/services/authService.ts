import { AuthResponse, LoginRequest, RegisterRequest } from '@/models';

import { apiClient } from './api/apiClient';

// Backend'deki AuthController'ın adresi (herkese açık, token gerektirmez)
const BASE_PATH = '/auth';

// Giriş ve kayıt uç noktaları
export const authService = {
  // POST /api/auth/login → kullanıcı adı ve şifre doğruysa token döner, yanlışsa 401
  login: (request: LoginRequest) => apiClient.post<AuthResponse>(`${BASE_PATH}/login`, request),
  // POST /api/auth/register → yeni kullanıcıyı kaydeder ve hemen token döner (ayrıca giriş yapmaya gerek yok).
  // Kullanıcı adı veya e-posta alınmışsa ya da alanlar kurallara uymuyorsa 400
  register: (request: RegisterRequest) => apiClient.post<AuthResponse>(`${BASE_PATH}/register`, request),
};
