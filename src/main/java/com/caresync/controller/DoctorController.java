package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.DoctorDTO;
import com.caresync.dto.DoctorScheduleDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    // All authenticated users can view doctors
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PagedResponse<DoctorDTO>>> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<DoctorDTO> doctors = doctorService.getAllDoctors(pageable);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    // All authenticated users can get count
    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> countDoctors() {
        long count = doctorService.countAllDoctors();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/count/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> countAvailableDoctors() {
        long count = doctorService.countAvailableDoctors();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    // All authenticated users can search
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PagedResponse<DoctorDTO>>> searchDoctors(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<DoctorDTO> doctors = doctorService.searchDoctors(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    // All authenticated users can view available doctors
    @GetMapping("/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAvailableDoctors() {
        List<DoctorDTO> doctors = doctorService.getAvailableDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    // All authenticated users can view doctor by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DoctorDTO>> getDoctorById(@PathVariable Long id) {
        DoctorDTO doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DoctorDTO>> getDoctorByUserId(@PathVariable Long userId) {
        DoctorDTO doctor = doctorService.getDoctorByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getDoctorsByDepartment(
            @PathVariable Long departmentId) {
        List<DoctorDTO> doctors = doctorService.getDoctorsByDepartment(departmentId);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/specialization/{specialization}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    // Only ADMIN can create doctors
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorDTO>> createDoctor(
            @Valid @RequestBody DoctorDTO doctorDTO) {
        DoctorDTO created = doctorService.createDoctor(doctorDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Doctor created successfully", created));
    }

    // ADMIN can update any; DOCTOR can update own
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isDoctorOwner(#id)")
    public ResponseEntity<ApiResponse<DoctorDTO>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorDTO doctorDTO) {
        DoctorDTO updated = doctorService.updateDoctor(id, doctorDTO);
        return ResponseEntity.ok(ApiResponse.success("Doctor updated successfully", updated));
    }

    // Only ADMIN can delete doctors
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted successfully", null));
    }

    // ADMIN can toggle any; DOCTOR can toggle own
    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isDoctorOwner(#id)")
    public ResponseEntity<ApiResponse<Void>> toggleDoctorAvailability(@PathVariable Long id) {
        doctorService.toggleDoctorAvailability(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor availability toggled successfully", null));
    }

    // All authenticated users can view schedules
    @GetMapping("/{doctorId}/schedules")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DoctorScheduleDTO>>> getDoctorSchedules(
            @PathVariable Long doctorId) {
        List<DoctorScheduleDTO> schedules = doctorService.getDoctorSchedules(doctorId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    // ADMIN can manage any; DOCTOR can manage own schedule
    @PostMapping("/{doctorId}/schedules")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<DoctorScheduleDTO>> addDoctorSchedule(
            @PathVariable Long doctorId,
            @Valid @RequestBody DoctorScheduleDTO scheduleDTO) {
        DoctorScheduleDTO created = doctorService.addDoctorSchedule(doctorId, scheduleDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule added successfully", created));
    }

    @PutMapping("/{doctorId}/schedules/{scheduleId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<DoctorScheduleDTO>> updateDoctorSchedule(
            @PathVariable Long doctorId,
            @PathVariable Long scheduleId,
            @Valid @RequestBody DoctorScheduleDTO scheduleDTO) {
        DoctorScheduleDTO updated = doctorService.updateDoctorSchedule(doctorId, scheduleId, scheduleDTO);
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", updated));
    }

    @DeleteMapping("/{doctorId}/schedules/{scheduleId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<Void>> deleteDoctorSchedule(
            @PathVariable Long doctorId,
            @PathVariable Long scheduleId) {
        doctorService.deleteDoctorSchedule(doctorId, scheduleId);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully", null));
    }
}
