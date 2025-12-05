package com.caresync.security;

import com.caresync.entity.*;
import com.caresync.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Security Service for custom authorization checks
 * Used in @PreAuthorize SpEL expressions
 */
@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final BillRepository billRepository;

    /**
     * Get current authenticated user
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String username;
        if (authentication.getPrincipal() instanceof UserDetails) {
            username = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else {
            username = authentication.getPrincipal().toString();
        }

        // Try to find by username first, then by email
        return userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username).orElse(null));
    }

    /**
     * Check if current user has a specific role
     */
    public boolean hasRole(String role) {
        User user = getCurrentUser();
        return user != null && user.getRole().name().equals(role);
    }

    /**
     * Check if user ID matches current user
     */
    public boolean isCurrentUser(Long userId) {
        User user = getCurrentUser();
        return user != null && user.getId().equals(userId);
    }

    /**
     * Check if current user is the owner of the patient record
     */
    public boolean isPatientOwner(Long patientId) {
        User user = getCurrentUser();
        if (user == null) return false;

        Optional<Patient> patient = patientRepository.findById(patientId);
        if (patient.isEmpty()) return false;

        // Check if patient's user_id matches current user
        return patient.get().getUser() != null && 
               patient.get().getUser().getId().equals(user.getId());
    }

    /**
     * Check if current user is the doctor
     */
    public boolean isDoctorOwner(Long doctorId) {
        User user = getCurrentUser();
        if (user == null) return false;

        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        if (doctor.isEmpty()) return false;

        return doctor.get().getUser() != null && 
               doctor.get().getUser().getId().equals(user.getId());
    }

    /**
     * Get doctor ID for current user (if user is a doctor)
     */
    public Long getCurrentDoctorId() {
        User user = getCurrentUser();
        if (user == null || user.getRole() != Role.DOCTOR) return null;

        return doctorRepository.findByUserId(user.getId())
                .map(Doctor::getId)
                .orElse(null);
    }

    /**
     * Get patient ID for current user (if user is a patient)
     */
    public Long getCurrentPatientId() {
        User user = getCurrentUser();
        if (user == null || user.getRole() != Role.PATIENT) return null;

        return patientRepository.findByUserId(user.getId())
                .map(Patient::getId)
                .orElse(null);
    }

    /**
     * Check if current user owns the appointment (patient or doctor)
     */
    public boolean isAppointmentOwner(Long appointmentId) {
        User user = getCurrentUser();
        if (user == null) return false;

        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
        if (appointment.isEmpty()) return false;

        Appointment apt = appointment.get();
        
        // Check if current user is the patient
        if (apt.getPatient() != null && apt.getPatient().getUser() != null &&
            apt.getPatient().getUser().getId().equals(user.getId())) {
            return true;
        }

        // Check if current user is the doctor
        if (apt.getDoctor() != null && apt.getDoctor().getUser() != null &&
            apt.getDoctor().getUser().getId().equals(user.getId())) {
            return true;
        }

        return false;
    }

    /**
     * Check if current user can view the appointment
     */
    public boolean canViewAppointment(Long appointmentId) {
        User user = getCurrentUser();
        if (user == null) return false;

        // ADMIN, RECEPTIONIST, TEST can view all
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.RECEPTIONIST || 
            user.getRole() == Role.TEST) {
            return true;
        }

        return isAppointmentOwner(appointmentId);
    }

    /**
     * Check if current user owns the prescription (patient or doctor)
     */
    public boolean isPrescriptionOwner(Long prescriptionId) {
        User user = getCurrentUser();
        if (user == null) return false;

        Optional<Prescription> prescription = prescriptionRepository.findById(prescriptionId);
        if (prescription.isEmpty()) return false;

        Prescription presc = prescription.get();

        // Check if current user is the patient
        if (presc.getPatient() != null && presc.getPatient().getUser() != null &&
            presc.getPatient().getUser().getId().equals(user.getId())) {
            return true;
        }

        // Check if current user is the doctor
        if (presc.getDoctor() != null && presc.getDoctor().getUser() != null &&
            presc.getDoctor().getUser().getId().equals(user.getId())) {
            return true;
        }

        return false;
    }

    /**
     * Check if current user can view the prescription
     */
    public boolean canViewPrescription(Long prescriptionId) {
        User user = getCurrentUser();
        if (user == null) return false;

        // ADMIN, TEST can view all
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.TEST) {
            return true;
        }

        return isPrescriptionOwner(prescriptionId);
    }

    /**
     * Check if current user owns the bill (patient)
     */
    public boolean isBillOwner(Long billId) {
        User user = getCurrentUser();
        if (user == null) return false;

        Optional<Bill> bill = billRepository.findById(billId);
        if (bill.isEmpty()) return false;

        Bill b = bill.get();

        // Check if current user is the patient
        return b.getPatient() != null && b.getPatient().getUser() != null &&
               b.getPatient().getUser().getId().equals(user.getId());
    }

    /**
     * Check if current user can view the bill
     */
    public boolean canViewBill(Long billId) {
        User user = getCurrentUser();
        if (user == null) return false;

        // ADMIN, RECEPTIONIST, TEST can view all
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.RECEPTIONIST || 
            user.getRole() == Role.TEST) {
            return true;
        }

        return isBillOwner(billId);
    }

    /**
     * Check if appointment belongs to current doctor
     */
    public boolean isAppointmentDoctor(Long appointmentId) {
        User user = getCurrentUser();
        if (user == null) return false;

        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
        if (appointment.isEmpty()) return false;

        Appointment apt = appointment.get();
        return apt.getDoctor() != null && apt.getDoctor().getUser() != null &&
               apt.getDoctor().getUser().getId().equals(user.getId());
    }

    /**
     * Check if appointment belongs to current patient
     */
    public boolean isAppointmentPatient(Long appointmentId) {
        User user = getCurrentUser();
        if (user == null) return false;

        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
        if (appointment.isEmpty()) return false;

        Appointment apt = appointment.get();
        return apt.getPatient() != null && apt.getPatient().getUser() != null &&
               apt.getPatient().getUser().getId().equals(user.getId());
    }
}
