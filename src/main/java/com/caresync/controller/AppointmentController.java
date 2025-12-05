package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.AppointmentDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.entity.AppointmentStatus;
import com.caresync.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ADMIN, RECEPTIONIST, TEST can view all appointments
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentDTO>>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<AppointmentDTO> appointments = appointmentService.getAllAppointments(pageable);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // ADMIN, RECEPTIONIST, TEST can get counts
    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<Long>> countAllAppointments() {
        long count = appointmentService.countAllAppointments();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/count/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'TEST')")
    public ResponseEntity<ApiResponse<Long>> countTodaysAppointments() {
        long count = appointmentService.countTodaysAppointments();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/count/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<Long>> countByStatus(@PathVariable AppointmentStatus status) {
        long count = appointmentService.countByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    // ADMIN, RECEPTIONIST, DOCTOR, NURSE, TEST can view today's appointments
    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'TEST')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getTodaysAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getTodaysAppointments();
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // ADMIN, RECEPTIONIST, TEST can view any doctor's today; DOCTOR can view own
    @GetMapping("/today/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getTodaysAppointmentsByDoctor(
            @PathVariable Long doctorId) {
        List<AppointmentDTO> appointments = appointmentService.getTodaysAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // All authenticated users can check available slots
    @GetMapping("/available-slots")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<LocalTime>>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalTime> slots = appointmentService.getAvailableSlots(doctorId, date);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    // ADMIN, RECEPTIONIST, TEST can view any; DOCTOR/PATIENT can view own
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isAppointmentOwner(#id)")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getAppointmentById(@PathVariable Long id) {
        AppointmentDTO appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    // ADMIN, RECEPTIONIST, TEST can view any patient's; PATIENT can view own
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isPatientOwner(#patientId)")
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentDTO>>> getAppointmentsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        PagedResponse<AppointmentDTO> appointments = appointmentService.getAppointmentsByPatient(patientId, pageable);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // ADMIN, RECEPTIONIST, TEST can view any doctor's; DOCTOR can view own
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentDTO>>> getAppointmentsByDoctor(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        PagedResponse<AppointmentDTO> appointments = appointmentService.getAppointmentsByDoctor(doctorId, pageable);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/doctor/{doctorId}/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getDoctorAppointmentsByDateRange(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AppointmentDTO> appointments = appointmentService.getDoctorAppointmentsByDateRange(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // ADMIN, DOCTOR, RECEPTIONIST, PATIENT can create appointments
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentDTO>> createAppointment(
            @Valid @RequestBody AppointmentDTO appointmentDTO) {
        AppointmentDTO created = appointmentService.createAppointment(appointmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment booked successfully", created));
    }

    // ADMIN, RECEPTIONIST can update any; DOCTOR/PATIENT can update own
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @securityService.isAppointmentOwner(#id)")
    public ResponseEntity<ApiResponse<AppointmentDTO>> updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentDTO appointmentDTO) {
        AppointmentDTO updated = appointmentService.updateAppointment(id, appointmentDTO);
        return ResponseEntity.ok(ApiResponse.success("Appointment updated successfully", updated));
    }

    // ADMIN, RECEPTIONIST can update any status; DOCTOR can update own
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @securityService.isAppointmentDoctor(#id)")
    public ResponseEntity<ApiResponse<Void>> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated successfully", null));
    }

    // ADMIN, RECEPTIONIST can delete any; DOCTOR/PATIENT can cancel own
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @securityService.isAppointmentOwner(#id)")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(ApiResponse.success("Appointment deleted successfully", null));
    }

    // ADMIN, RECEPTIONIST can cancel any; DOCTOR/PATIENT can cancel own
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @securityService.isAppointmentOwner(#id)")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(@PathVariable Long id) {
        appointmentService.updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", null));
    }

    // ADMIN, RECEPTIONIST can complete any; DOCTOR can complete own
    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @securityService.isAppointmentDoctor(#id)")
    public ResponseEntity<ApiResponse<Void>> completeAppointment(@PathVariable Long id) {
        appointmentService.updateAppointmentStatus(id, AppointmentStatus.COMPLETED);
        return ResponseEntity.ok(ApiResponse.success("Appointment marked as completed", null));
    }
}
