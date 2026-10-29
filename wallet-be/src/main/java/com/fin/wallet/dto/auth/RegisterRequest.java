package com.fin.wallet.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// POST /api/auth/register isteğinin gövdesi.
// Uzunluk sınırları User entity'sindeki kolon uzunluklarıyla aynı; sığmayan değer veritabanına gitmeden 400 ile reddedilir.
public record RegisterRequest(
		@NotBlank @Size(max = 50) String firstName,
		@NotBlank @Size(max = 50) String lastName,
		@NotBlank @Size(min = 3, max = 50) String userName,
		@NotBlank @Email @Size(max = 100) String email,
		@NotBlank @Size(min = 6, max = 100) String password) {
}
