package DATAJPA.Controller;

import DATAJPA.Dto.DoctorDetailDto;
import DATAJPA.Dto.DoctorDto;
import DATAJPA.Entity.Doctor;
import DATAJPA.Service.Doctorservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Doctors")
public class DoctorController {

    @Autowired
    private Doctorservice doctorService;

    // Get all Doctors - All roles can view doctor list (returns DTOs to prevent lazy loading)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        return new ResponseEntity<>(doctorService.getAllDoctorsDto(), HttpStatus.OK);
    }

    // Get Doctor by ID - All roles can view doctor details (returns detailed DTO)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<DoctorDetailDto> getDoctorById(@PathVariable Long id) {
        return new ResponseEntity<>(doctorService.getDoctorDetailDto(id), HttpStatus.OK);
    }

    // Create a new Doctor - Only ADMIN can create
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return new ResponseEntity<>(doctorService.saveDoctor(doctor), HttpStatus.CREATED);
    }

    // Update Doctor - ADMIN and DOCTOR (self) can update
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Doctor> updateDoctor(@RequestBody Doctor doctor, @PathVariable Long id) {
        return new ResponseEntity<>(doctorService.updateDoctor(doctor, id), HttpStatus.OK);
    }

    // Delete Doctor - Only ADMIN can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return new ResponseEntity<>("Doctor deleted successfully", HttpStatus.OK);
    }
}
