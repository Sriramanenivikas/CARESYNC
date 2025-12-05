package com.caresync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for validating an access code.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidateAccessCodeRequest {
    private String code;
}

