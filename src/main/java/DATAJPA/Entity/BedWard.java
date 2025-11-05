package DATAJPA.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "ward_details")
public class BedWard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ward_code", nullable = false, unique = true, length = 20)
    private String wardCode;

    @Column(name = "ward_name", nullable = false, unique = true, length = 100)
    private String wardName;

    @Column(name = "ward_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private WardType wardType;

    @Column(name = "floor_number", nullable = false)
    @Min(0)
    private Integer floorNumber;

    @Column(name = "total_beds", nullable = false)
    @Min(1)
    private Integer totalBeds;

    @Column(name = "available_beds", nullable = false)
    @Min(0)
    private Integer availableBeds;

    @Column(name = "phone", length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incharge_nurse_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User inchargeNurse;

    @OneToMany(mappedBy = "ward", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"ward"})
    @Builder.Default
    private List<Bed> beds = new ArrayList<>();

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

    public enum WardType {
        GENERAL, ICU, NICU, PICU, CCU, EMERGENCY, MATERNITY
    }
}

