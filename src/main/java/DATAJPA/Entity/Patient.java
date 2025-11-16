package DATAJPA.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "patient_details")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_code", nullable = false, unique = true, length = 20)
    @NotBlank(message = "Patient code is required")
    @Size(max = 20, message = "Patient code must not exceed 20 characters")
    private String patientCode;

    @Column(name = "first_name", nullable = false, length = 100)
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name must only contain letters and spaces")
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name must only contain letters and spaces")
    private String lastName;

    @Column(name = "email")
    @Email(message = "Please provide a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Column(name = "gender", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Gender is required")
    private Gender gender;

    @Column(name = "blood_group", length = 10)
    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;

    @Column(name = "date_of_birth", nullable = false)
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Column(name = "phone_primary", nullable = false, length = 20)
    @NotBlank(message = "Primary phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid phone number (10-15 digits)")
    private String phonePrimary;

    @Column(name = "phone_secondary", length = 20)
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid secondary phone number (10-15 digits)")
    private String phoneSecondary;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "marital_status", length = 20)
    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "chronic_conditions", columnDefinition = "TEXT")
    private String chronicConditions;

    @Column(name = "current_medications", columnDefinition = "TEXT")
    private String currentMedications;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore  // Prevent lazy loading issues during serialization
    private User user;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<EmergencyContact> emergencyContacts = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MedicalRecord> medicalRecords = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<BedAssignment> bedAssignments = new ArrayList<>();

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Insurance insurance;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "is_active")
    private Boolean isActive;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum BloodGroup {
        A_POSITIVE, A_NEGATIVE, B_POSITIVE, B_NEGATIVE,
        O_POSITIVE, O_NEGATIVE, AB_POSITIVE, AB_NEGATIVE
    }

    public enum MaritalStatus {
        SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED
    }

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", patientCode='" + patientCode + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", gender=" + gender +
                ", bloodGroup=" + bloodGroup +
                '}';
    }
}
