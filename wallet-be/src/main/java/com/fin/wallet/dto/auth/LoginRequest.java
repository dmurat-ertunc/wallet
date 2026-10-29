package com.fin.wallet.dto.auth;

import jakarta.validation.constraints.NotBlank;

// POST /api/auth/login isteğinin gövdesi.
// Şifre içerdiği için bu nesne loglanmamalı: record'un otomatik toString'i şifreyi de yazar.
public record LoginRequest(
		@NotBlank String userName,
		@NotBlank String password) {
}
