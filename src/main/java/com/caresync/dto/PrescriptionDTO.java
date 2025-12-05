package com.caresync.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDTO {
    private Long id;
    private Long appointmentId;
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    private String patientName;
    
    // Nested patient object for frontend compatibility
    private PatientDTO patient;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    private String doctorName;
    
    // Nested doctor object for frontend compatibility
    private DoctorDTO doctor;
    
    private String diagnosis;
    
    // Direct medication fields for frontend compatibility (flattened from first item)
    private String medicationName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
    
    private String notes;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
    
    @Valid
    private List<PrescriptionItemDTO> items;
}
