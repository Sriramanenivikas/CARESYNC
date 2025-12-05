package com.caresync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItemDTO {
    private Long id;
    private Long prescriptionId;
    
    @NotBlank(message = "Medicine name is required")
    @Size(max = 100, message = "Medicine name must be less than 100 characters")
    private String medicineName;
    
    @NotBlank(message = "Dosage is required")
    @Size(max = 50, message = "Dosage must be less than 50 characters")
    private String dosage;
    
    @NotBlank(message = "Frequency is required")
    @Size(max = 50, message = "Frequency must be less than 50 characters")
    private String frequency;
    
    @NotBlank(message = "Duration is required")
    @Size(max = 50, message = "Duration must be less than 50 characters")
    private String duration;
    
    private Integer quantity;
    private String instructions;
}
