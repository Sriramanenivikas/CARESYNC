package com.caresync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for AccessCode entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessCodeDTO {
    private Long id;
    private String code;
    private String createdBy;
    private String note;
    private Integer usageCount;
    private Boolean isActive;
    private LocalDateTime lastUsed;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Long remainingMinutes;
}

