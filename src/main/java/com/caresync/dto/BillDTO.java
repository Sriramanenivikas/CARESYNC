package com.caresync.dto;

import com.caresync.entity.BillStatus;
import com.caresync.entity.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDTO {
    private Long id;
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    private String patientName;
    private String patientPhone;
    
    // Nested patient object for frontend compatibility
    private PatientDTO patient;
    
    // Nested appointment object for frontend compatibility
    private AppointmentDTO appointment;
    
    private Long appointmentId;
    private String billNumber;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal finalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceDue;
    private BillStatus status;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentDate;
    private LocalDate dueDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Aliases for frontend compatibility
    @JsonProperty("amount")
    public BigDecimal getAmount() {
        return finalAmount != null ? finalAmount : totalAmount;
    }
    
    @JsonProperty("description")
    public String getDescription() {
        return notes;
    }
    
    @Valid
    private List<BillItemDTO> items;
}
