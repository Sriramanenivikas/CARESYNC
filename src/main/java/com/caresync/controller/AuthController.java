package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.LoginRequest;
import com.caresync.dto.LoginResponse;
import com.caresync.dto.RegisterRequest;
import com.caresync.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication Controller - Handles login, register, and token operations
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    /**
     * User login
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * User registration
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    /**
     * Refresh token
     * POST /api/auth/refresh-token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Refresh token is required"));
        }
        LoginResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    /**
     * Get current authenticated user info
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse.UserInfo>> getCurrentUser() {
        LoginResponse.UserInfo userInfo = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(userInfo));
    }

    /**
     * Logout (client-side token removal)
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // JWT is stateless, so logout is handled client-side by removing the token
        // This endpoint exists for consistency and potential future server-side token blacklisting
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
