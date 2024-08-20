package com.cda.pedagoplanet.exception;

public class AuthentificationFailedException extends RuntimeException {
    public AuthentificationFailedException(String message) {
        super(message);
    }
    public AuthentificationFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}

