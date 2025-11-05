package DATAJPA.Controller;

import DATAJPA.Dto.AppointmentDetailDto;
import DATAJPA.Dto.AppointmentDto;
import DATAJPA.Entity.Appointment;
import DATAJPA.Service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Create appointment - PATIENT, RECEPTIONIST, ADMIN can create
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Appointment created = appointmentService.saveAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Get all appointments - ADMIN, DOCTOR, RECEPTIONIST can view all (returns DTOs)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsDto());
    }

    // Get appointment by ID - All roles can view (returns detailed DTO)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<AppointmentDetailDto> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentDetailDto(id));
    }

    // Get appointments by patient ID - All roles can view (returns DTOs)
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientIdDto(patientId));
    }

    // Get appointments by doctor ID - ADMIN, DOCTOR, RECEPTIONIST can view (returns DTOs)
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorIdDto(doctorId));
    }

    // Get appointments by status - ADMIN, DOCTOR, RECEPTIONIST can view (returns DTOs)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatusDto(
                Appointment.AppointmentStatus.valueOf(status)));
    }

    // Update appointment - ADMIN, RECEPTIONIST can update, DOCTOR can update status
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.updateAppointment(appointment, id));
    }

    // Cancel appointment - ADMIN, RECEPTIONIST, PATIENT can cancel
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(appointmentService.updateAppointment(appointment, id));
    }

    // Delete appointment - Only ADMIN can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }
}

