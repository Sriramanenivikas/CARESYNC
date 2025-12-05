package com.caresync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Bill entity for patient billing
 */
@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "bill_number", nullable = false, unique = true, length = 50)
    private String billNumber;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal finalAmount = BigDecimal.ZERO;

    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BillStatus status = BillStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Bill has many items
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BillItem> items = new ArrayList<>();

    // Helper method to calculate totals
    public void calculateTotals() {
        this.totalAmount = BigDecimal.ZERO;
        for (BillItem item : items) {
            this.totalAmount = this.totalAmount.add(item.getTotalPrice());
        }
        this.finalAmount = totalAmount.subtract(discountAmount).add(taxAmount);
    }

    // Helper to get balance due
    public BigDecimal getBalanceDue() {
        return finalAmount.subtract(paidAmount);
    }
}
