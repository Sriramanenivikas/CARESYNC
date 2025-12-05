package com.caresync.service;

import com.caresync.dto.AppointmentDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.entity.AppointmentStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Service interface for Appointment operations
 */
public interface AppointmentService {
    
    PagedResponse<AppointmentDTO> getAllAppointments(Pageable pageable);
    
    AppointmentDTO getAppointmentById(Long id);
    
    AppointmentDTO createAppointment(AppointmentDTO appointmentDTO);
    
    AppointmentDTO updateAppointment(Long id, AppointmentDTO appointmentDTO);
    
    void deleteAppointment(Long id);
    
    void updateAppointmentStatus(Long id, AppointmentStatus status);
    
    // Patient appointments
    PagedResponse<AppointmentDTO> getAppointmentsByPatient(Long patientId, Pageable pageable);
    
    // Doctor appointments
    PagedResponse<AppointmentDTO> getAppointmentsByDoctor(Long doctorId, Pageable pageable);
    
    // Today's appointments
    List<AppointmentDTO> getTodaysAppointments();
    
    List<AppointmentDTO> getTodaysAppointmentsByDoctor(Long doctorId);
    
    // Date range
    List<AppointmentDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate);
    
    List<AppointmentDTO> getDoctorAppointmentsByDateRange(Long doctorId, LocalDate startDate, LocalDate endDate);
    
    // Available slots
    List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date);
    
    // Check conflicts
    boolean hasConflict(Long doctorId, LocalDate date, LocalTime time);
    
    // Counts
    long countAllAppointments();
    
    long countTodaysAppointments();
    
    long countByStatus(AppointmentStatus status);
}
