package com.fin.wallet.exception;

// GlobalExceptionHandler tarafından 401 Unauthorized olarak döner.
// Mobil uygulama /auth/refresh'ten 401 alınca oturumun bittiğini anlar ve login ekranına yönlendirir.
// Token bulunamadı, süresi doldu, daha önce kullanıldı veya kullanıcı pasif: hepsinde aynı mesaj döner,
// böylece saldırgan hangi durumda olduğunu öğrenemez.
public class InvalidRefreshTokenException extends RuntimeException {

	public InvalidRefreshTokenException() {
		super("Invalid refresh token");
	}

}
