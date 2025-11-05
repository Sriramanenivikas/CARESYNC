package DATAJPA.Service.impl;

import DATAJPA.Dto.AppointmentDetailDto;
import DATAJPA.Dto.AppointmentDto;
import DATAJPA.Entity.Appointment;
import DATAJPA.Entity.Doctor;
import DATAJPA.Entity.Patient;
import DATAJPA.Repository.AppointmentRepository;
import DATAJPA.Repository.DoctorRepository;
import DATAJPA.Repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService implements DATAJPA.Service.AppointmentService  {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public Appointment CreateNewAppointment(Appointment appointment, Long doctorId, Long patientId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        if (appointment.getId() != null) throw new IllegalArgumentException("Appointment  error");
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        patient.getAppointments().add(appointment);
        return   appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment reassignAppointmentToDoctor(Long appointmentId, Long newDoctorId) {
        // Find the existing appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));

        // Find the new doctor
        Doctor newDoctor = doctorRepository.findById(newDoctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + newDoctorId));

        // Reassign the appointment to the new doctor
        appointment.setDoctor(newDoctor);

        // Save and return the updated appointment
        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public Appointment updateAppointment(Appointment appointment, Long id) {
        Appointment existingAppointment = getAppointmentById(id);

        if (appointment.getAppointmentDate() != null) {
            existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
        }
        if (appointment.getAppointmentTime() != null) {
            existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
        }
        if (appointment.getStatus() != null) {
            existingAppointment.setStatus(appointment.getStatus());
        }
        if (appointment.getAppointmentType() != null) {
            existingAppointment.setAppointmentType(appointment.getAppointmentType());
        }
        if (appointment.getPriority() != null) {
            existingAppointment.setPriority(appointment.getPriority());
        }
        if (appointment.getReason() != null) {
            existingAppointment.setReason(appointment.getReason());
        }
        if (appointment.getNotes() != null) {
            existingAppointment.setNotes(appointment.getNotes());
        }
        if (appointment.getConsultationFee() != null) {
            existingAppointment.setConsultationFee(appointment.getConsultationFee());
        }
        if (appointment.getSymptoms() != null) {
            existingAppointment.setSymptoms(appointment.getSymptoms());
        }

        return appointmentRepository.save(existingAppointment);
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointmentRepository.delete(appointment);
    }

    @Override
    @Transactional
    public List<AppointmentDto> getAllAppointmentsDto() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDetailDto getAppointmentDetailDto(Long id) {
        Appointment appointment = getAppointmentById(id);
        return mapToAppointmentDetailDto(appointment);
    }

    @Override
    @Transactional
    public List<AppointmentDto> getAppointmentsByPatientIdDto(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AppointmentDto> getAppointmentsByDoctorIdDto(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AppointmentDto> getAppointmentsByStatusDto(Appointment.AppointmentStatus status) {
        return appointmentRepository.findByStatus(status).stream()
                .map(this::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    // Helper method to map Appointment entity to AppointmentDto
    private AppointmentDto mapToAppointmentDto(Appointment appointment) {
        String doctorName = appointment.getDoctor() != null
            ? appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName()
            : "Unknown";

        return new AppointmentDto(
            appointment.getId(),
            appointment.getAppointmentDate() + " " + appointment.getAppointmentTime(),
            doctorName,
            appointment.getReason()
        );
    }

    // Helper method to map Appointment entity to AppointmentDetailDto
    private AppointmentDetailDto mapToAppointmentDetailDto(Appointment appointment) {
        return AppointmentDetailDto.builder()
            .id(appointment.getId())
            .appointmentCode(appointment.getAppointmentCode())
            .appointmentDate(appointment.getAppointmentDate())
            .appointmentTime(appointment.getAppointmentTime())
            .appointmentType(appointment.getAppointmentType() != null ? appointment.getAppointmentType().toString() : null)
            .status(appointment.getStatus() != null ? appointment.getStatus().toString() : null)
            .priority(appointment.getPriority() != null ? appointment.getPriority().toString() : null)
            .reason(appointment.getReason())
            .symptoms(appointment.getSymptoms())
            .notes(appointment.getNotes())
            .consultationFee(appointment.getConsultationFee())
            .patientId(appointment.getPatient() != null ? appointment.getPatient().getId() : null)
            .patientName(appointment.getPatient() != null
                ? appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName()
                : null)
            .patientCode(appointment.getPatient() != null ? appointment.getPatient().getPatientCode() : null)
            .doctorId(appointment.getDoctor() != null ? appointment.getDoctor().getId() : null)
            .doctorName(appointment.getDoctor() != null
                ? appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName()
                : null)
            .doctorSpecialization(appointment.getDoctor() != null ? appointment.getDoctor().getSpecialization() : null)
            .departmentId(appointment.getDepartment() != null ? appointment.getDepartment().getId() : null)
            .departmentName(appointment.getDepartment() != null ? appointment.getDepartment().getDepartmentName() : null)
            .createdAt(appointment.getCreatedAt() != null ? appointment.getCreatedAt().toString() : null)
            .updatedAt(appointment.getUpdatedAt() != null ? appointment.getUpdatedAt().toString() : null)
            .build();
    }

}
