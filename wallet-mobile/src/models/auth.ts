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

// Başarılı giriş veya kayıtta dönen cevap; token sonraki her isteğin Authorization başlığına eklenir
export interface AuthResponse {
  token: string;
}
