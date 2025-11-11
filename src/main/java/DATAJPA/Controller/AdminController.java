package DATAJPA.Controller;

import DATAJPA.Entity.Appointment;
import DATAJPA.Entity.User;
import DATAJPA.Exception.ResourceNotFoundException;
import DATAJPA.Repository.*;
import DATAJPA.Service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // All endpoints require ADMIN role
public class AdminController {

    private final ActivityLogService activityLogService;
    private final Userrepositary userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillMasterRepository billMasterRepository;
    private final StaffProfileRepository staffProfileRepository;

    // Get system statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();

        // Get actual counts from repositories
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());

        // Today's appointments
        LocalDate today = LocalDate.now();
        stats.put("todayAppointments", appointmentRepository.countByAppointmentDateBetween(today, today));

        // Pending bills
        stats.put("pendingBills", billMasterRepository.countByPaymentStatus("PENDING"));

        // Total revenue (all time)
        stats.put("totalRevenue", billMasterRepository.sumTotalAmount());

        // Active staff count
        stats.put("activeStaff", staffProfileRepository.count());

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
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Set default values if not provided
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        // Save user to database
        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // Update user status (activate/deactivate)
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam Boolean isActive) {

        // Find user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Update status
        user.setIsActive(isActive);
        user.setUpdatedAt(LocalDateTime.now());

        // Save updated user
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(updatedUser);
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
