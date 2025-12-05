package com.caresync.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long id;
    private Long userId;
    private Long departmentId;
    private String departmentName;
    
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String phone;
    
    @NotBlank(message = "Specialization is required")
    @Size(max = 100, message = "Specialization must be less than 100 characters")
    private String specialization;
    
    private String qualification;
    
    @NotBlank(message = "License number is required")
    private String licenseNumber;
    
    @Min(value = 0, message = "Experience years cannot be negative")
    @Max(value = 60, message = "Experience years cannot exceed 60")
    private Integer experienceYears;
    
    @DecimalMin(value = "0.0", message = "Consultation fee cannot be negative")
    private BigDecimal consultationFee;
    
    private String bio;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Computed
    private String fullName;
    private List<DoctorScheduleDTO> schedules;
}
