package DATAJPA.Dto;
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
public class PatientDto {
    private Long id;
    private String patientCode;
    private String firstName;
    private String lastName;
    private String middleName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;

    // Contact Information
    private String email;
    private String phonePrimary;
    private String phoneSecondary;

    // Address Information
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    // Personal Details
    private String maritalStatus;
    private String occupation;
    private LocalDate registrationDate;

    // Medical History
    private String allergies;
    private String chronicConditions;
    private String currentMedications;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactPhone;

    // System fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;

    // Legacy/Computed fields (for backward compatibility)
    @Deprecated
    private String name; // Computed from firstName + lastName
    @Deprecated
    private String birthdate; // Use dateOfBirth instead
    private Long insuranceId;
    private Integer appointmentCount;
}
