package DATAJPA.Exception;

/**
 * Exception thrown when JWT token is invalid, expired, or malformed
 */
public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}

