package com.fin.wallet.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

// Uygulamadaki tüm hata türlerinin tek listesi.
// name() (ör. USERNAME_TAKEN) istemciye "code" olarak gider ve bir kez yayınlandıktan sonra DEĞİŞTİRİLMEZ;
// mobil uygulama hatayı mesaj metninden değil bu koddan tanır.
// message geliştirici için İngilizce açıklamadır; %s yer tutucuları BusinessException'a verilen argümanlarla doldurulur.
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// --- Genel istek hataları (GlobalExceptionHandler, Spring'in kendi exception'larından üretir) ---
	VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Validation failed"),
	MALFORMED_REQUEST(HttpStatus.BAD_REQUEST, "Request could not be read"),
	ENDPOINT_NOT_FOUND(HttpStatus.NOT_FOUND, "Endpoint not found"),
	METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "HTTP method not supported"),

	// --- Kimlik doğrulama / yetki ---
	AUTHENTICATION_REQUIRED(HttpStatus.UNAUTHORIZED, "Authentication required"),
	INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid username or password"),
	INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "Invalid refresh token"),
	ACCESS_DENIED(HttpStatus.FORBIDDEN, "Access denied"),

	// --- Kullanıcı ---
	USERNAME_TAKEN(HttpStatus.CONFLICT, "Username is already taken"),
	EMAIL_TAKEN(HttpStatus.CONFLICT, "Email is already registered"),

	// --- Harcama ---
	EXPENSE_NOT_FOUND(HttpStatus.NOT_FOUND, "Expense not found with id: %s"),
	EXPENSE_ID_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "A new expense cannot already have an id"),
	EXPENSE_ID_REQUIRED(HttpStatus.BAD_REQUEST, "Id must be provided in the body"),
	EXPENSE_ID_MISMATCH(HttpStatus.BAD_REQUEST, "Id in the path and the body do not match"),
	// 422: istek geçerli ama iş kuralına aykırı. %s = silme limiti (ExpenseServiceImpl.DELETE_LIMIT)
	EXPENSE_DELETE_LIMIT_EXCEEDED(HttpStatus.UNPROCESSABLE_CONTENT, "Expenses above %s cannot be deleted"),
	// EXPENSE_DELETE_LIMIT_EXCEEDED => yaptğımız tanımdaki hata kodunun adı, service de bu kod ile çağırırız
	// HttpStatus.UNPROCESSABLE_CONTENT => Htttp.Status clasında spring tarafından tanımlı kodlar, bu hatanın kodu bu diye biz burada ekliyoruz
	// message => message kısmında mesaj olarak ne gösterileceğini biz yazıyoruz

	// --- Beklenmeyen ---
	INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");

	private final HttpStatus status;
	private final String message;

}
