package com.caresync.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillItemDTO {
    private Long id;
    private Long billId;
    
    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;
    
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @DecimalMin(value = "0.0", message = "Unit price cannot be negative")
    private BigDecimal unitPrice;
    
    private BigDecimal totalPrice;
}
