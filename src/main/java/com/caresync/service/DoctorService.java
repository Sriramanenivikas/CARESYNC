package com.caresync.service;

import com.caresync.dto.DoctorDTO;
import com.caresync.dto.DoctorScheduleDTO;
import com.caresync.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for Doctor operations
 */
public interface DoctorService {
    
    PagedResponse<DoctorDTO> getAllDoctors(Pageable pageable);
    
    PagedResponse<DoctorDTO> searchDoctors(String search, Pageable pageable);
    
    DoctorDTO getDoctorById(Long id);
    
    DoctorDTO getDoctorByUserId(Long userId);
    
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    
    DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO);
    
    void deleteDoctor(Long id);
    
    List<DoctorDTO> getDoctorsByDepartment(Long departmentId);
    
    List<DoctorDTO> getAvailableDoctors();
    
    List<DoctorDTO> getDoctorsBySpecialization(String specialization);
    
    // Schedule operations
    List<DoctorScheduleDTO> getDoctorSchedules(Long doctorId);
    
    DoctorScheduleDTO addDoctorSchedule(Long doctorId, DoctorScheduleDTO scheduleDTO);
    
    DoctorScheduleDTO updateDoctorSchedule(Long doctorId, Long scheduleId, DoctorScheduleDTO scheduleDTO);
    
    void deleteDoctorSchedule(Long doctorId, Long scheduleId);
    
    void toggleDoctorAvailability(Long id);
    
    long countAllDoctors();
    
    long countAvailableDoctors();
}
