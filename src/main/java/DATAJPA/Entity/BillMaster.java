package DATAJPA.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bill_master")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Long billId;

    @Column(name = "bill_number", nullable = false, unique = true, length = 50)
    private String billNumber;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "bed_assignment_id")
    private Long bedAssignmentId;

    @CreationTimestamp
    @Column(name = "bill_date")
    private LocalDateTime billDate;

    @Builder.Default
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "tax_amount", precision = 12, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "net_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal netAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "paid_amount", precision = 12, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "balance_amount", precision = 12, scale = 2)
    private BigDecimal balanceAmount = BigDecimal.ZERO;

    @Column(name = "payment_status", length = 20)
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name = "bill_type", length = 30)
    @Enumerated(EnumType.STRING)
    private BillType billType;

    @Builder.Default
    @Column(name = "insurance_claim_amount", precision = 12, scale = 2)
    private BigDecimal insuranceClaimAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "discharged")
    private Boolean discharged = false;

    @Column(name = "discharge_date")
    private LocalDateTime dischargeDate;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @JsonIgnore
    @OneToMany(mappedBy = "billMaster", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BillItem> billItems = new ArrayList<>();

    public enum PaymentStatus {
        UNPAID, PARTIAL, PAID, REFUNDED
    }

    public enum BillType {
        OPD, IPD, EMERGENCY, PHARMACY, LAB
    }
}
