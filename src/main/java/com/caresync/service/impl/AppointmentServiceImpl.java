package com.caresync.service.impl;

import com.caresync.dto.AppointmentDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.entity.*;
import com.caresync.exception.BadRequestException;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.AppointmentRepository;
import com.caresync.repository.DoctorRepository;
import com.caresync.repository.DoctorScheduleRepository;
import com.caresync.repository.PatientRepository;
import com.caresync.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository scheduleRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AppointmentDTO> getAllAppointments(Pageable pageable) {
        Page<Appointment> page = appointmentRepository.findAll(pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        return mapToDTO(appointment);
    }

    @Override
    public AppointmentDTO createAppointment(AppointmentDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", dto.getDoctorId()));

        // Check if doctor is available
        if (!doctor.getIsAvailable()) {
            throw new BadRequestException("Doctor is not available");
        }

        // Check for conflicts
        if (hasConflict(dto.getDoctorId(), dto.getAppointmentDate(), dto.getAppointmentTime())) {
            throw new BadRequestException("This time slot is already booked");
        }

        // Calculate end time based on slot duration
        LocalTime endTime = dto.getEndTime();
        if (endTime == null) {
            endTime = dto.getAppointmentTime().plusMinutes(30); // Default 30 min slot
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .appointmentTime(dto.getAppointmentTime())
                .endTime(endTime)
                .status(AppointmentStatus.SCHEDULED)
                .reason(dto.getReason())
                .symptoms(dto.getSymptoms())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapToDTO(saved);
    }

    @Override
    public AppointmentDTO updateAppointment(Long id, AppointmentDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        // If changing date/time, check for conflicts
        if (!appointment.getAppointmentDate().equals(dto.getAppointmentDate()) ||
            !appointment.getAppointmentTime().equals(dto.getAppointmentTime())) {
            if (hasConflict(appointment.getDoctor().getId(), dto.getAppointmentDate(), dto.getAppointmentTime())) {
                throw new BadRequestException("This time slot is already booked");
            }
        }

        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setEndTime(dto.getEndTime());
        appointment.setReason(dto.getReason());
        appointment.setSymptoms(dto.getSymptoms());
        appointment.setDiagnosis(dto.getDiagnosis());
        appointment.setNotes(dto.getNotes());
        if (dto.getStatus() != null) {
            appointment.setStatus(dto.getStatus());
        }

        Appointment updated = appointmentRepository.save(appointment);
        return mapToDTO(updated);
    }

    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        appointmentRepository.delete(appointment);
    }

    @Override
    public void updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AppointmentDTO> getAppointmentsByPatient(Long patientId, Pageable pageable) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient", "id", patientId);
        }
        Page<Appointment> page = appointmentRepository.findByPatientId(patientId, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AppointmentDTO> getAppointmentsByDoctor(Long doctorId, Pageable pageable) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        Page<Appointment> page = appointmentRepository.findByDoctorId(doctorId, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> getTodaysAppointments() {
        return appointmentRepository.findTodaysAppointments().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> getTodaysAppointmentsByDoctor(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        return appointmentRepository.findTodaysAppointmentsByDoctor(doctorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findAppointmentsBetweenDates(startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> getDoctorAppointmentsByDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        return appointmentRepository.findDoctorAppointmentsBetweenDates(doctorId, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findByIdWithSchedules(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        // Get day of week for the requested date
        DayOfWeek dayOfWeek = DayOfWeek.valueOf(date.getDayOfWeek().name());

        // Find doctor's schedule for that day
        DoctorSchedule schedule = scheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
                .orElse(null);

        if (schedule == null || !schedule.getIsAvailable()) {
            return new ArrayList<>(); // Doctor not available on this day
        }

        // Get existing appointments for that day
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndDate(doctorId, date);
        List<LocalTime> bookedSlots = existingAppointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toList());

        // Generate available slots
        List<LocalTime> availableSlots = new ArrayList<>();
        LocalTime slotTime = schedule.getStartTime();
        int slotDuration = schedule.getSlotDurationMinutes();

        while (slotTime.isBefore(schedule.getEndTime())) {
            if (!bookedSlots.contains(slotTime)) {
                // If date is today, only show future slots
                if (!date.equals(LocalDate.now()) || slotTime.isAfter(LocalTime.now())) {
                    availableSlots.add(slotTime);
                }
            }
            slotTime = slotTime.plusMinutes(slotDuration);
        }

        return availableSlots;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasConflict(Long doctorId, LocalDate date, LocalTime time) {
        return appointmentRepository.findConflictingAppointment(doctorId, date, time).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public long countAllAppointments() {
        return appointmentRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public long countTodaysAppointments() {
        return appointmentRepository.countTodaysAppointments();
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(AppointmentStatus status) {
        return appointmentRepository.countByStatus(status);
    }

    // Helper methods
    private PagedResponse<AppointmentDTO> buildPagedResponse(Page<Appointment> page) {
        List<AppointmentDTO> content = page.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<AppointmentDTO>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private AppointmentDTO mapToDTO(Appointment appointment) {
        return AppointmentDTO.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getFullName())
                .patientPhone(appointment.getPatient().getPhone())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getFullName())
                .doctorSpecialization(appointment.getDoctor().getSpecialization())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .endTime(appointment.getEndTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .symptoms(appointment.getSymptoms())
                .diagnosis(appointment.getDiagnosis())
                .notes(appointment.getNotes())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt())
                .build();
    }
}
