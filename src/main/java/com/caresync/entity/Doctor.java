package com.caresync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Doctor entity for doctor profiles
 */
@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String specialization;

    @Column(length = 255)
    private String qualification;

    @Column(name = "license_number", nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @Column(name = "experience_years", nullable = false)
    @Builder.Default
    private Integer experienceYears = 0;

    @Column(name = "consultation_fee", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal consultationFee = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Doctor has many schedules
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DoctorSchedule> schedules = new ArrayList<>();

    // Doctor has many appointments
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Appointment> appointments = new ArrayList<>();

    // Doctor has many prescriptions
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Prescription> prescriptions = new ArrayList<>();

    // Helper method for full name
    public String getFullName() {
        return "Dr. " + firstName + " " + lastName;
    }
}
