package com.caresync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Doctor schedule entity for weekly availability
 */
@Entity
@Table(name = "doctor_schedules", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"doctor_id", "day_of_week"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, columnDefinition = "day_of_week")
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "slot_duration_minutes", nullable = false)
    @Builder.Default
    private Integer slotDurationMinutes = 30;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
