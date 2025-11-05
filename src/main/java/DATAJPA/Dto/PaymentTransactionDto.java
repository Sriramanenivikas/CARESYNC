package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransactionDto {

    private Long transactionId;
    private Long billId;
    private String transactionNumber;
    private LocalDateTime paymentDate;
    private BigDecimal amount;
    private String paymentMode;
    private String paymentStatus;
    private String referenceNumber;
    private String cardType;
    private String cardLast4;
    private String upiId;
    private String bankName;
    private String chequeNumber;
    private LocalDate chequeDate;
    private String receivedBy;
    private String notes;
}

