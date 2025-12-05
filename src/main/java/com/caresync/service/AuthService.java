package com.caresync.service;

import com.caresync.dto.LoginRequest;
import com.caresync.dto.LoginResponse;
import com.caresync.dto.RegisterRequest;

/**
 * Authentication Service Interface
 */
public interface AuthService {

    /**
     * Authenticate user and return JWT token
     */
    LoginResponse login(LoginRequest request);

    /**
     * Register a new user
     */
    LoginResponse register(RegisterRequest request);

    /**
     * Refresh JWT token
     */
    LoginResponse refreshToken(String refreshToken);

    /**
     * Get current authenticated user info
     */
    LoginResponse.UserInfo getCurrentUser();
}
