package DATAJPA.Controller;

import DATAJPA.Entity.User;
import DATAJPA.Service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // All endpoints require ADMIN role
public class AdminController {

    private final ActivityLogService activityLogService;

    // Get system statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", 0); // TODO: Implement actual count
        stats.put("totalPatients", 0);
        stats.put("totalDoctors", 0);
        stats.put("totalAppointments", 0);
        stats.put("todayAppointments", 0);
        stats.put("pendingBills", 0);
        stats.put("todayRevenue", 0);
        stats.put("activeStaff", 0);
        return ResponseEntity.ok(stats);
    }

    // Get all activity logs
    @GetMapping("/activity-logs")
    public ResponseEntity<?> getActivityLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String module) {
        if (userId != null && module != null) {
            return ResponseEntity.ok(activityLogService.getUserActivities(userId));
        } else if (module != null) {
            return ResponseEntity.ok(activityLogService.getModuleActivities(module));
        } else if (userId != null) {
            return ResponseEntity.ok(activityLogService.getUserActivities(userId));
        }
        return ResponseEntity.ok("Please provide userId or module parameter");
    }

    // Get activity logs by date range
    @GetMapping("/activity-logs/date-range")
    public ResponseEntity<?> getActivityLogsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return ResponseEntity.ok(activityLogService.getActivitiesByDateRange(start, end));
    }

    // Create new user (for admin user management)
    @PostMapping("/users")
    public ResponseEntity<Map<String, String>> createUser(@RequestBody User user) {
        // TODO: Implement user creation service
        Map<String, String> response = new HashMap<>();
        response.put("message", "User creation endpoint - to be implemented");
        return ResponseEntity.ok(response);
    }

    // Update user status (activate/deactivate)
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam Boolean isActive) {
        // TODO: Implement user status update
        Map<String, String> response = new HashMap<>();
        response.put("message", "User " + userId + " status updated to " + isActive);
        return ResponseEntity.ok(response);
    }

    // Get revenue reports
    @GetMapping("/reports/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", 0);
        report.put("opdRevenue", 0);
        report.put("ipdRevenue", 0);
        report.put("pharmacyRevenue", 0);
        report.put("labRevenue", 0);
        return ResponseEntity.ok(report);
    }

    // Get appointment statistics
    @GetMapping("/reports/appointments")
    public ResponseEntity<Map<String, Object>> getAppointmentReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalAppointments", 0);
        report.put("completed", 0);
        report.put("scheduled", 0);
        report.put("cancelled", 0);
        report.put("noShow", 0);
        return ResponseEntity.ok(report);
    }

    // Get bed occupancy report
    @GetMapping("/reports/bed-occupancy")
    public ResponseEntity<Map<String, Object>> getBedOccupancyReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalBeds", 0);
        report.put("occupied", 0);
        report.put("available", 0);
        report.put("maintenance", 0);
        report.put("occupancyRate", 0);
        return ResponseEntity.ok(report);
    }
}
