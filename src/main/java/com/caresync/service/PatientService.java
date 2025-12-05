package com.caresync.service;

import com.caresync.dto.PatientDTO;
import com.caresync.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for Patient operations
 */
public interface PatientService {
    
    PagedResponse<PatientDTO> getAllPatients(Pageable pageable);
    
    PagedResponse<PatientDTO> searchPatients(String search, Pageable pageable);
    
    PatientDTO getPatientById(Long id);
    
    PatientDTO getPatientByUserId(Long userId);
    
    PatientDTO createPatient(PatientDTO patientDTO);
    
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    
    void deletePatient(Long id);
    
    List<PatientDTO> getPatientsByBloodGroup(String bloodGroup);
    
    long countAllPatients();
}
