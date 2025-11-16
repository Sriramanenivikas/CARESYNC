package DATAJPA.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDetailDto {
    private Long id;

    @NotBlank(message = "Doctor code is required")
    @Size(max = 20, message = "Doctor code must not exceed 20 characters")
    private String doctorCode;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name must only contain letters and spaces")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name must only contain letters and spaces")
    private String lastName;

    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Primary phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid phone number (10-15 digits)")
    private String phonePrimary;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid secondary phone number (10-15 digits)")
    private String phoneSecondary;

    @NotBlank(message = "Specialization is required")
    @Size(max = 100, message = "Specialization must not exceed 100 characters")
    private String specialization;

    @NotBlank(message = "Qualification is required")
    @Size(max = 255, message = "Qualification must not exceed 255 characters")
    private String qualification;

    @NotBlank(message = "License number is required")
    @Size(max = 100, message = "License number must not exceed 100 characters")
    private String licenseNumber;

    @Min(value = 0, message = "Experience years cannot be negative")
    @Max(value = 70, message = "Experience years seems unrealistic")
    private Integer experienceYears;

    @DecimalMin(value = "0.0", message = "Consultation fee cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Consultation fee must have at most 10 digits and 2 decimal places")
    private BigDecimal consultationFee;

    private String availabilityStatus;

    @NotNull(message = "Joining date is required")
    @PastOrPresent(message = "Joining date cannot be in the future")
    private LocalDate joiningDate;

    // Department info
    private List<DepartmentDto> departments;

    // Schedule info
    private List<DoctorScheduleDto> schedules;

    // Statistics
    private Integer totalAppointments;
    private Integer todayAppointments;
}

