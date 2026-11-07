// Backend'deki com.fin.wallet.dto.auth paketindeki record'ların aynası

// POST /api/auth/login gövdesi
export interface LoginRequest {
  userName: string;
  password: string;
}

// POST /api/auth/register gövdesi; kurallar backend'deki RegisterRequest ile aynı (bkz. useRegisterForm)
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

// Başarılı giriş, kayıt veya yenilemede dönen cevap.
// accessToken: kısa ömürlü (15 dk) JWT, sonraki her isteğin Authorization başlığına eklenir.
// refreshToken: uzun ömürlü (30 gün), sadece /auth/refresh ve /auth/logout'a gönderilir.
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// POST /api/auth/refresh ve /api/auth/logout gövdesi
export interface RefreshRequest {
  refreshToken: string;
}
