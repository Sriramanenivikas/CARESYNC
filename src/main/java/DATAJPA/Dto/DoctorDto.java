package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {
    private Long id;
    private String doctorCode;

    // Basic Information
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName; // Computed field for display
    private LocalDate dateOfBirth;
    private String gender;

    // Contact Information
    private String email;
    private String phonePrimary;
    private String phoneSecondary;

    // Professional Details
    private String specialization;
    private String qualification;
    private String licenseNumber;
    private Integer experienceYears;
    private LocalDate joiningDate;
    private BigDecimal consultationFee;
    private String roomNumber;
    private String availabilityStatus; // AVAILABLE, BUSY, ON_LEAVE, UNAVAILABLE

    // Address Information
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactPhone;

    // System fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;

    // Relationships
    private Long departmentId;
    private String departmentName;
    private Long userId; // Link to User entity for authentication
}

