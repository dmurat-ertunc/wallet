package com.fin.wallet.dto.auth;

// Başarılı login/register sonrası mobil uygulamaya dönen token
public record AuthResponse(String token) {
}
