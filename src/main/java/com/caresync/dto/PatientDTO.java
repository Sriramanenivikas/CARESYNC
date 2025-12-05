package com.caresync.dto;

import com.caresync.entity.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Long id;
    private Long userId;
    
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    @NotNull(message = "Gender is required")
    private Gender gender;
    
    private String bloodGroup;
    
    @NotBlank(message = "Phone number is required")
    @Size(max = 20, message = "Phone must be less than 20 characters")
    private String phone;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String medicalHistory;
    private String allergies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Computed fields
    private String fullName;
    private Integer age;
}
