package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.DashboardDTO;
import com.caresync.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    // ADMIN and TEST can view admin dashboard
    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEST')")
    public ResponseEntity<ApiResponse<DashboardDTO>> getAdminDashboard() {
        DashboardDTO dashboard = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    // ADMIN, TEST can view any doctor's dashboard; DOCTOR can view own
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEST') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<DashboardDTO>> getDoctorDashboard(@PathVariable Long doctorId) {
        DashboardDTO dashboard = dashboardService.getDoctorDashboard(doctorId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    // ADMIN, TEST can view any patient's dashboard; PATIENT can view own
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEST') or @securityService.isPatientOwner(#patientId)")
    public ResponseEntity<ApiResponse<DashboardDTO>> getPatientDashboard(@PathVariable Long patientId) {
        DashboardDTO dashboard = dashboardService.getPatientDashboard(patientId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
