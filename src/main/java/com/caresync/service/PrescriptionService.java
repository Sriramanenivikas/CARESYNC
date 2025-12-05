package com.caresync.service;

import com.caresync.dto.PrescriptionDTO;
import com.caresync.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for Prescription operations
 */
public interface PrescriptionService {
    
    PagedResponse<PrescriptionDTO> getAllPrescriptions(Pageable pageable);
    
    PrescriptionDTO getPrescriptionById(Long id);
    
    PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO);
    
    PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO);
    
    void deletePrescription(Long id);
    
    // By patient
    PagedResponse<PrescriptionDTO> getPrescriptionsByPatient(Long patientId, Pageable pageable);
    
    List<PrescriptionDTO> getRecentPrescriptionsByPatient(Long patientId, int limit);
    
    // By doctor
    PagedResponse<PrescriptionDTO> getPrescriptionsByDoctor(Long doctorId, Pageable pageable);
    
    // By appointment
    PrescriptionDTO getPrescriptionByAppointment(Long appointmentId);
    
    // Counts
    long countAllPrescriptions();
    
    long countPrescriptionsByDoctor(Long doctorId);
}
