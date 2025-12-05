package com.caresync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Access Code entity for controlling write operations.
 * Only admin can generate codes, users need them to modify hospital data.
 */
@Entity
@Table(name = "access_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(length = 255)
    private String note;

    @Column(name = "usage_count", nullable = false)
    @Builder.Default
    private Integer usageCount = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "last_used")
    private LocalDateTime lastUsed;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * Check if this code has expired
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Check if this code is valid (active and not expired)
     */
    public boolean isValid() {
        return isActive && !isExpired();
    }
}

