package DATAJPA.Controller;

import DATAJPA.Entity.User;
import DATAJPA.Service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getAdminDashboard(user));
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> getDoctorDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getDoctorDashboard(user));
    }

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> getPatientDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getPatientDashboard(user));
    }

    @GetMapping("/receptionist")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Map<String, Object>> getReceptionistDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getReceptionistDashboard(user));
    }

    @GetMapping("/nurse")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<Map<String, Object>> getNurseDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getNurseDashboard(user));
    }

    @GetMapping("/pharmacist")
    @PreAuthorize("hasRole('PHARMACIST')")
    public ResponseEntity<Map<String, Object>> getPharmacistDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getPharmacistDashboard(user));
    }

    @GetMapping("/lab-technician")
    @PreAuthorize("hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Map<String, Object>> getLabTechnicianDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getLabTechnicianDashboard(user));
    }

    /**
     * Universal endpoint that returns user info and their appropriate dashboard URL
     * Frontend can use this to determine where to redirect after login
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyDashboard(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("role", user.getRole().name());
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("dashboardUrl", getDashboardUrlForRole(user.getRole()));

        return ResponseEntity.ok(response);
    }

    /**
     * Auto-redirect endpoint that automatically routes to the correct dashboard
     * based on user's role
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAutoDashboard(@AuthenticationPrincipal User user) {
        if (user.getRole() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User role not defined"));
        }

        switch (user.getRole()) {
            case ADMIN:
                return getAdminDashboard(user);
            case DOCTOR:
                return getDoctorDashboard(user);
            case PATIENT:
                return getPatientDashboard(user);
            case RECEPTIONIST:
                return getReceptionistDashboard(user);
            case NURSE:
                return getNurseDashboard(user);
            case PHARMACIST:
                return getPharmacistDashboard(user);
            case LAB_TECHNICIAN:
                return getLabTechnicianDashboard(user);
            default:
                return ResponseEntity.badRequest().body(Map.of("error", "Unknown role"));
        }
    }

    private String getDashboardUrlForRole(User.Role role) {
        if (role == null) {
            return "/api/dashboard/me";
        }

        switch (role) {
            case ADMIN:
                return "/api/dashboard/admin";
            case DOCTOR:
                return "/api/dashboard/doctor";
            case PATIENT:
                return "/api/dashboard/patient";
            case RECEPTIONIST:
                return "/api/dashboard/receptionist";
            case NURSE:
                return "/api/dashboard/nurse";
            case PHARMACIST:
                return "/api/dashboard/pharmacist";
            case LAB_TECHNICIAN:
                return "/api/dashboard/lab-technician";
            default:
                return "/api/dashboard/me";
        }
    }
}
