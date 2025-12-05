package com.caresync.service.impl;

import com.caresync.dto.LoginRequest;
import com.caresync.dto.LoginResponse;
import com.caresync.dto.RegisterRequest;
import com.caresync.entity.Role;
import com.caresync.entity.User;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.DoctorRepository;
import com.caresync.repository.PatientRepository;
import com.caresync.repository.UserRepository;
import com.caresync.security.JwtTokenProvider;
import com.caresync.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Authentication Service Implementation
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        try {
            // Authenticate user with username
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user from database by username or email
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseGet(() -> userRepository.findByEmail(request.getUsername())
                            .orElseThrow(() -> new ResourceNotFoundException("User", "username", request.getUsername())));

            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generate tokens using username
            String token = jwtTokenProvider.generateToken(user.getUsername());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());

            return buildLoginResponse(user, token, refreshToken);

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken: " + request.getUsername());
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // Generate tokens
        String token = jwtTokenProvider.generateToken(savedUser.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getEmail());

        return buildLoginResponse(savedUser, token, refreshToken);
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", username)));

        String newToken = jwtTokenProvider.generateToken(user.getUsername());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());

        return buildLoginResponse(user, newToken, newRefreshToken);
    }

    @Override
    public LoginResponse.UserInfo getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("User not authenticated");
        }

        String username;
        if (authentication.getPrincipal() instanceof UserDetails) {
            username = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else {
            username = authentication.getPrincipal().toString();
        }

        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", username)));

        // Get patientId or doctorId based on role
        Long patientId = null;
        Long doctorId = null;
        
        if (user.getRole() == Role.PATIENT) {
            patientId = patientRepository.findByUserId(user.getId())
                    .map(p -> p.getId())
                    .orElse(null);
        } else if (user.getRole() == Role.DOCTOR) {
            doctorId = doctorRepository.findByUserId(user.getId())
                    .map(d -> d.getId())
                    .orElse(null);
        }

        return LoginResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .dashboardUrl(LoginResponse.getDashboardUrl(user.getRole()))
                .patientId(patientId)
                .doctorId(doctorId)
                .build();
    }

    /**
     * Build login response with user info and tokens
     */
    private LoginResponse buildLoginResponse(User user, String token, String refreshToken) {
        // Get patientId or doctorId based on role
        Long patientId = null;
        Long doctorId = null;
        
        if (user.getRole() == Role.PATIENT) {
            patientId = patientRepository.findByUserId(user.getId())
                    .map(p -> p.getId())
                    .orElse(null);
        } else if (user.getRole() == Role.DOCTOR) {
            doctorId = doctorRepository.findByUserId(user.getId())
                    .map(d -> d.getId())
                    .orElse(null);
        }
        
        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .dashboardUrl(LoginResponse.getDashboardUrl(user.getRole()))
                        .patientId(patientId)
                        .doctorId(doctorId)
                        .build())
                .build();
    }
}
