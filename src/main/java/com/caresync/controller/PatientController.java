package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.PagedResponse;
import com.caresync.dto.PatientDTO;
import com.caresync.service.PatientService;
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
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    // ADMIN, DOCTOR, NURSE, RECEPTIONIST, TEST can view all patients
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<PagedResponse<PatientDTO>>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<PatientDTO> patients = patientService.getAllPatients(pageable);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    // ADMIN, DOCTOR, NURSE, RECEPTIONIST, TEST can get count
    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<Long>> countPatients() {
        long count = patientService.countAllPatients();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    // ADMIN, DOCTOR, NURSE, RECEPTIONIST, TEST can search patients
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<PagedResponse<PatientDTO>>> searchPatients(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<PatientDTO> patients = patientService.searchPatients(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    // ADMIN, DOCTOR, NURSE, RECEPTIONIST, TEST can view patient by ID; PATIENT can view own
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST') or @securityService.isPatientOwner(#id)")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientById(@PathVariable Long id) {
        PatientDTO patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    // ADMIN, DOCTOR, NURSE, RECEPTIONIST, TEST can view; PATIENT can view own
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST') or @securityService.isCurrentUser(#userId)")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientByUserId(@PathVariable Long userId) {
        PatientDTO patient = patientService.getPatientByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    // ADMIN, DOCTOR, NURSE, RECEPTIONIST, TEST can view by blood group
    @GetMapping("/blood-group/{bloodGroup}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<List<PatientDTO>>> getPatientsByBloodGroup(
            @PathVariable String bloodGroup) {
        List<PatientDTO> patients = patientService.getPatientsByBloodGroup(bloodGroup);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    // Only ADMIN and RECEPTIONIST can create patients
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<PatientDTO>> createPatient(
            @Valid @RequestBody PatientDTO patientDTO) {
        PatientDTO created = patientService.createPatient(patientDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Patient created successfully", created));
    }

    // ADMIN, RECEPTIONIST can update any; PATIENT can update own
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @securityService.isPatientOwner(#id)")
    public ResponseEntity<ApiResponse<PatientDTO>> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientDTO patientDTO) {
        PatientDTO updated = patientService.updatePatient(id, patientDTO);
        return ResponseEntity.ok(ApiResponse.success("Patient updated successfully", updated));
    }

    // Only ADMIN can delete patients
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient deleted successfully", null));
    }
}
