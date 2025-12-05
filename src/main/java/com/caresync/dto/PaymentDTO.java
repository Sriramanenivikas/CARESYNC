package com.caresync.dto;

import com.caresync.entity.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for processing payments
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    
    @NotNull(message = "Bill ID is required")
    private Long billId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    private String notes;
}
