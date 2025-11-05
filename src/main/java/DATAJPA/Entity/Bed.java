package DATAJPA.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "bed_details", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"ward_id", "bed_number"})
})
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bed_code", nullable = false, unique = true, length = 20)
    private String bedCode;

    @Column(name = "bed_number", nullable = false, length = 20)
    private String bedNumber;

    @Column(name = "bed_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private BedType bedType;

    @Column(name = "status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private BedStatus status;

    @Column(name = "daily_charge", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyCharge;

    @Column(name = "has_oxygen")
    private Boolean hasOxygen;

    @Column(name = "has_ventilator")
    private Boolean hasVentilator;

    @Column(name = "has_monitor")
    private Boolean hasMonitor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id", nullable = false)
    @JsonIgnoreProperties({"beds", "hibernateLazyInitializer", "handler"})
    private BedWard ward;

    @OneToMany(mappedBy = "bed", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"bed"})
    @Builder.Default
    private List<BedAssignment> assignments = new ArrayList<>();

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

    public enum BedType {
        STANDARD, DELUXE, ICU, VENTILATOR
    }

    public enum BedStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
    }
}

