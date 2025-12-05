package com.caresync.dto;

import com.caresync.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login response DTO with JWT token and user info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private Role role;
        private String dashboardUrl;
        private Long patientId;  // For PATIENT role
        private Long doctorId;   // For DOCTOR role
    }

    /**
     * Get dashboard URL based on role
     */
    public static String getDashboardUrl(Role role) {
        return switch (role) {
            case ADMIN -> "/dashboard/admin";
            case DOCTOR -> "/dashboard/doctor";
            case PATIENT -> "/dashboard/patient";
            case NURSE -> "/dashboard/nurse";
            case RECEPTIONIST -> "/dashboard/receptionist";
            case TEST -> "/dashboard/admin"; // TEST users see admin dashboard (read-only)
        };
    }
}
