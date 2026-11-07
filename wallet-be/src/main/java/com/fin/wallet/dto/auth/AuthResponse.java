package com.fin.wallet.dto.auth;

// Başarılı login/register/refresh sonrası mobil uygulamaya dönen token'lar.
// accessToken: kısa ömürlü JWT, her isteğin Authorization başlığına eklenir.
// refreshToken: uzun ömürlü rastgele değer, sadece /api/auth/refresh ve /api/auth/logout'a gönderilir.
public record AuthResponse(String accessToken, String refreshToken) {
}
