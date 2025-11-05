package DATAJPA.Controller;

import DATAJPA.Dto.PatientDetailDto;
import DATAJPA.Dto.PatientDto;
import DATAJPA.Dto.BloodGroupCountDto;
import DATAJPA.Entity.Patient;
import DATAJPA.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // Create a new patient - ADMIN and RECEPTIONIST can create
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        return new ResponseEntity<>(patientService.savePatient(patient), HttpStatus.CREATED);
    }

    // Get all patients - ADMIN, DOCTOR, RECEPTIONIST, NURSE can view all
    // Returns optimized DTO to prevent lazy loading issues
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<List<PatientDto>> getAllPatients() {
        return new ResponseEntity<>(patientService.getAllPatientsOptimized(), HttpStatus.OK);
    }

    // OPTIMIZED: Get all patients without loading relationships (for large datasets)
    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<List<PatientDto>> getAllPatientsOptimized() {
        return new ResponseEntity<>(patientService.getAllPatientsOptimized(), HttpStatus.OK);
    }

    // OPTIMIZED: Get paginated patients (RECOMMENDED for lakhs of records)
    @GetMapping("/paginated")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<Page<PatientDto>> getAllPatientsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return new ResponseEntity<>(patientService.getAllPatientsPaginated(pageable), HttpStatus.OK);
    }

    // Returns detailed DTO with all information
    // Get patient by ID - All roles can view
    @GetMapping("/{id}")
    public ResponseEntity<PatientDetailDto> getPatientById(@PathVariable Long id) {
        return new ResponseEntity<>(patientService.getPatientDetailById(id), HttpStatus.OK);
    }

    // Get patient with full details (insurance + appointments)
    @GetMapping("/{id}/details")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<PatientDetailDto> getPatientDetailById(@PathVariable Long id) {
        return new ResponseEntity<>(patientService.getPatientDetailById(id), HttpStatus.OK);
    }

    // Update patient - ADMIN and RECEPTIONIST can update
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Patient> updatePatient(@RequestBody Patient patient, @PathVariable Long id) {
        return new ResponseEntity<>(patientService.updatePatient(patient, id), HttpStatus.OK);
    }

    // Delete patient - Only ADMIN can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return new ResponseEntity<>("Patient deleted successfully", HttpStatus.OK);
    }

    // Aggregation: counts by blood group
    @GetMapping("/stats/blood-groups")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<List<BloodGroupCountDto>> getCountsByBloodGroup() {
        return new ResponseEntity<>(patientService.getCountsByBloodGroup(), HttpStatus.OK);
    }
}
