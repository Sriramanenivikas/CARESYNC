package com.caresync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new access code.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccessCodeRequest {
    private String note;
}

