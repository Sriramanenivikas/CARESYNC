package DATAJPA.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescription_items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false)
    private String medicineName;

    @Column(name = "medicine_type", length = 50)
    private String medicineType;

    @Column(name = "dosage", nullable = false, length = 100)
    private String dosage;

    @Column(name = "frequency", nullable = false, length = 100)
    private String frequency;

    @Column(name = "duration", nullable = false, length = 100)
    private String duration;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "route", length = 50)
    private String route;

    @Column(name = "timing", length = 100)
    private String timing;

    @Builder.Default
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions = null;

    @Builder.Default
    @Column(name = "is_dispensed")
    private Boolean isDispensed = false;

    @Builder.Default
    @Column(name = "dispensed_quantity")
    private Integer dispensedQuantity = 0;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
