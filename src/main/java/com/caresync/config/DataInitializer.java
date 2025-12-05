package com.caresync.config;

import com.caresync.entity.Role;
import com.caresync.entity.User;
import com.caresync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Data Initializer for production environment
 * Ensures demo users exist with correct passwords
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("prod")
    public CommandLineRunner initData() {
        return args -> {
            log.info("Checking and initializing demo users...");

            // Create or update demo users with correct passwords
            createOrUpdateUser("admin", "admin@caresync.com", "Admin@123", Role.ADMIN);
            createOrUpdateUser("test", "test@caresync.com", "Test@123$", Role.TEST);
            createOrUpdateUser("dr.smith", "dr.smith@caresync.com", "Doctor@123", Role.DOCTOR);
            createOrUpdateUser("nurse.lisa", "nurse.lisa@caresync.com", "Nurse@123", Role.NURSE);
            createOrUpdateUser("reception.mary", "reception.mary@caresync.com", "Recept@123", Role.RECEPTIONIST);
            createOrUpdateUser("patient.robert", "patient.robert@caresync.com", "Patient@123", Role.PATIENT);

            log.info("Demo users initialization complete!");
        };
    }

    private void createOrUpdateUser(String username, String email, String password, Role role) {
        userRepository.findByUsername(username).ifPresentOrElse(
            user -> {
                // Update password if user exists
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
                log.info("Updated password for user: {}", username);
            },
            () -> {
                // Create new user if doesn't exist
                User newUser = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .role(role)
                        .isActive(true)
                        .build();
                userRepository.save(newUser);
                log.info("Created demo user: {}", username);
            }
        );
    }
}

