package com.caresync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Prescription item entity for individual medicines
 */
@Entity
@Table(name = "prescription_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false, length = 100)
    private String medicineName;

    @Column(nullable = false, length = 50)
    private String dosage;

    @Column(nullable = false, length = 50)
    private String frequency;

    @Column(nullable = false, length = 50)
    private String duration;

    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
