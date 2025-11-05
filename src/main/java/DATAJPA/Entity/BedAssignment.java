package DATAJPA.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "bed_assignments")
public class BedAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assignment_code", nullable = false, unique = true, length = 20)
    private String assignmentCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bed_id", nullable = false)
    @JsonIgnoreProperties({"assignments", "hibernateLazyInitializer", "handler"})
    private Bed bed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Doctor assignedByDoctor;

    @Column(name = "admission_date", nullable = false)
    private LocalDateTime admissionDate;

    @Column(name = "expected_discharge_date")
    private java.time.LocalDate expectedDischargeDate;

    @Column(name = "actual_discharge_date")
    private LocalDateTime actualDischargeDate;

    @Column(name = "admission_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private AdmissionType admissionType;

    @Column(name = "admission_reason", nullable = false, columnDefinition = "TEXT")
    private String admissionReason;

    @Column(name = "status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    @Column(name = "daily_charge", precision = 10, scale = 2)
    private BigDecimal dailyCharge;

    @Column(name = "total_charges", precision = 10, scale = 2)
    private BigDecimal totalCharges;

    @Column(name = "discharge_summary", columnDefinition = "TEXT")
    private String dischargeSummary;

    @Column(name = "discharge_instructions", columnDefinition = "TEXT")
    private String dischargeInstructions;

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

    public enum AdmissionType {
        EMERGENCY, SCHEDULED, TRANSFER
    }

    public enum AssignmentStatus {
        ACTIVE, DISCHARGED, TRANSFERRED
    }
}

