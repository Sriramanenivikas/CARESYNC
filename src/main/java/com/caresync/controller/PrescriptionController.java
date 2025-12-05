package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.PagedResponse;
import com.caresync.dto.PrescriptionDTO;
import com.caresync.service.PrescriptionService;
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
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    // ADMIN, NURSE, TEST can view all prescriptions
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'TEST')")
    public ResponseEntity<ApiResponse<PagedResponse<PrescriptionDTO>>> getAllPrescriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<PrescriptionDTO> prescriptions = prescriptionService.getAllPrescriptions(pageable);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    // ADMIN, NURSE, TEST can get count
    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'TEST')")
    public ResponseEntity<ApiResponse<Long>> countPrescriptions() {
        long count = prescriptionService.countAllPrescriptions();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    // ADMIN, NURSE, TEST can view any; DOCTOR can view own count
    @GetMapping("/count/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'TEST') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<Long>> countPrescriptionsByDoctor(@PathVariable Long doctorId) {
        long count = prescriptionService.countPrescriptionsByDoctor(doctorId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    // ADMIN, NURSE, TEST can view any; DOCTOR/PATIENT can view own
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'TEST') or @securityService.isPrescriptionOwner(#id)")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> getPrescriptionById(@PathVariable Long id) {
        PrescriptionDTO prescription = prescriptionService.getPrescriptionById(id);
        return ResponseEntity.ok(ApiResponse.success(prescription));
    }

    // ADMIN, DOCTOR, NURSE, TEST can view any patient's; PATIENT can view own
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'TEST') or @securityService.isPatientOwner(#patientId)")
    public ResponseEntity<ApiResponse<PagedResponse<PrescriptionDTO>>> getPrescriptionsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsByPatient(patientId, pageable);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/patient/{patientId}/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'TEST') or @securityService.isPatientOwner(#patientId)")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getRecentPrescriptionsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "5") int limit) {
        List<PrescriptionDTO> prescriptions = prescriptionService.getRecentPrescriptionsByPatient(patientId, limit);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    // ADMIN, NURSE, TEST can view any doctor's; DOCTOR can view own
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'TEST') or @securityService.isDoctorOwner(#doctorId)")
    public ResponseEntity<ApiResponse<PagedResponse<PrescriptionDTO>>> getPrescriptionsByDoctor(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsByDoctor(doctorId, pageable);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    // ADMIN, TEST, DOCTOR can view by appointment
    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEST') or @securityService.isAppointmentOwner(#appointmentId)")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> getPrescriptionByAppointment(
            @PathVariable Long appointmentId) {
        PrescriptionDTO prescription = prescriptionService.getPrescriptionByAppointment(appointmentId);
        return ResponseEntity.ok(ApiResponse.success(prescription));
    }

    // Only DOCTOR can create prescriptions
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> createPrescription(
            @Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        PrescriptionDTO created = prescriptionService.createPrescription(prescriptionDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Prescription created successfully", created));
    }

    // Only DOCTOR can update own prescriptions
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') and @securityService.isPrescriptionOwner(#id)")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        PrescriptionDTO updated = prescriptionService.updatePrescription(id, prescriptionDTO);
        return ResponseEntity.ok(ApiResponse.success("Prescription updated successfully", updated));
    }

    // ADMIN or DOCTOR (own) can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('DOCTOR') and @securityService.isPrescriptionOwner(#id))")
    public ResponseEntity<ApiResponse<Void>> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully", null));
    }
}
