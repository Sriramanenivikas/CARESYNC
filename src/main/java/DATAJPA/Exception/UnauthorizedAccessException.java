package DATAJPA.Exception;

/**
 * Exception thrown when user tries to access a resource without proper authorization
 * (e.g., USER trying to perform ADMIN-only action)
 */
public class UnauthorizedAccessException extends RuntimeException {

    public UnauthorizedAccessException(String message) {
        super(message);
    }

    public UnauthorizedAccessException(String action, String requiredRole) {
        super(String.format("Access denied. '%s' requires role: %s", action, requiredRole));
    }
}

