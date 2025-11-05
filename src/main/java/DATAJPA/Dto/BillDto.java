package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BillDto {

    private Long billId;
    private String billNumber;
    private Long patientId;
    private String patientName;
    private Long appointmentId;
    private Long bedAssignmentId;
    private LocalDateTime billDate;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal netAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private String paymentStatus;
    private String billType;
    private BigDecimal insuranceClaimAmount;
    private Boolean discharged;
    private LocalDateTime dischargeDate;
    private String createdBy;
    private String notes;
    private List<BillItemDto> billItems;
}

