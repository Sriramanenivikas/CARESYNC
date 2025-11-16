package DATAJPA.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDetailDto {
    private Long id;

    @NotBlank(message = "Patient code is required")
    @Size(max = 20, message = "Patient code must not exceed 20 characters")
    private String patientCode;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name must only contain letters and spaces")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name must only contain letters and spaces")
    private String lastName;

    @Email(message = "Please provide a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotNull(message = "Gender is required")
    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    @Pattern(regexp = "A_POSITIVE|A_NEGATIVE|B_POSITIVE|B_NEGATIVE|O_POSITIVE|O_NEGATIVE|AB_POSITIVE|AB_NEGATIVE",
             message = "Invalid blood group")
    private String bloodGroup;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Primary phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid phone number (10-15 digits)")
    private String phonePrimary;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid secondary phone number (10-15 digits)")
    private String phoneSecondary;

    @Size(max = 255, message = "Address line 1 must not exceed 255 characters")
    private String addressLine1;

    @Size(max = 255, message = "Address line 2 must not exceed 255 characters")
    private String addressLine2;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @Pattern(regexp = "^[0-9]{5,10}$", message = "Please provide a valid postal code")
    private String postalCode;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @Pattern(regexp = "SINGLE|MARRIED|DIVORCED|WIDOWED|SEPARATED",
             message = "Marital status must be SINGLE, MARRIED, DIVORCED, WIDOWED, or SEPARATED")
    private String maritalStatus;

    @Size(max = 100, message = "Occupation must not exceed 100 characters")
    private String occupation;

    private String allergies;
    private String chronicConditions;
    private String currentMedications;
    private LocalDateTime createdAt;
    private InsuranceDto insurance;
    private List<AppointmentDto> appointments = new ArrayList<>();
}
