package com.fin.wallet.exception;

// Returned to the client as 400 Bad Request by GlobalExceptionHandler
public class BadRequestException extends RuntimeException {

	public BadRequestException(String message) {
		super(message);
	}

}
