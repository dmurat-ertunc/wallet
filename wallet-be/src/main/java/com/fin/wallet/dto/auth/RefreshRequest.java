package com.fin.wallet.dto.auth;

import jakarta.validation.constraints.NotBlank;

// POST /api/auth/refresh ve /api/auth/logout isteklerinin gövdesi.
// Refresh token bir oturum anahtarı gibidir; bu nesne loglanmamalı.
public record RefreshRequest(
		@NotBlank String refreshToken) {
}
