package com.fin.wallet.exception;

import lombok.Getter;

// Uygulamanın bilerek fırlattığı tüm hatalar bu sınıftır; hangi hata olduğunu ErrorCode söyler.
// RuntimeException: imzalara "throws" yazmak gerekmez ve @Transactional varsayılan olarak rollback yapar.
// Status ayrı bir alanda tutulmaz; errorCode.getStatus() tek doğru kaynaktır.
@Getter
public class BusinessException extends RuntimeException {

	private final ErrorCode errorCode;

	// args, ErrorCode mesajındaki %s yer tutucularını sırayla doldurur:
	// new BusinessException(ErrorCode.EXPENSE_NOT_FOUND, 9) -> "Expense not found with id: 9"
	public BusinessException(ErrorCode errorCode, Object... args) {
		super(String.format(errorCode.getMessage(), args)); // super ile üst sınıfın( RuntimeException ) messsage kısmına mesajı set'liyoruz
		// üst sınıfın (RuntimeException) constructor'ını çağırır ve mesajı ona teslim eder
		this.errorCode = errorCode;

		//Neden super ilk satırda olmak zorunda? Java'nın kuralı: bir nesne inşa edilirken önce temeli,
		// yani üst sınıf kurulur. Kat çıkmadan önce zemin dökülür. Bu yüzden şunu yazamazsın:

//		public BusinessException(ErrorCode errorCode, Object... args) {
//			this.errorCode = errorCode;                              // ❌ derlenmez
//			super(String.format(errorCode.getMessage(), args));      //    super ilk satırda olmalı
//		}
	}

}
