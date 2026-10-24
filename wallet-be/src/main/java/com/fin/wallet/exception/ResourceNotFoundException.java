package com.fin.wallet.exception;

// Returned to the client as 404 Not Found by GlobalExceptionHandler
public class ResourceNotFoundException extends RuntimeException {

	public ResourceNotFoundException(String resourceName, Object id) {
		super(resourceName + " not found with id: " + id);
	}

}
