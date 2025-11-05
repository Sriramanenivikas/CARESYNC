package DATAJPA.Service;

import DATAJPA.Dto.BillDto;
import DATAJPA.Dto.BillItemDto;
import DATAJPA.Dto.PaymentTransactionDto;
import DATAJPA.Entity.BillItem;
import DATAJPA.Entity.BillMaster;
import DATAJPA.Entity.PaymentTransaction;
import DATAJPA.Repository.BillItemRepository;
import DATAJPA.Repository.BillMasterRepository;
import DATAJPA.Repository.PaymentTransactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BillingService {

    private final BillMasterRepository billMasterRepository;
    private final BillItemRepository billItemRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Autowired(required = false)
    private NotificationService notificationService;

    public BillingService(BillMasterRepository billMasterRepository,
                         BillItemRepository billItemRepository,
                         PaymentTransactionRepository paymentTransactionRepository) {
        this.billMasterRepository = billMasterRepository;
        this.billItemRepository = billItemRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    @Transactional
    public BillDto createBill(BillDto billDto) {
        // Generate bill number
        String billNumber = generateBillNumber(billDto.getBillType());

        // Create bill master
        BillMaster billMaster = BillMaster.builder()
                .billNumber(billNumber)
                .patientId(billDto.getPatientId())
                .appointmentId(billDto.getAppointmentId())
                .bedAssignmentId(billDto.getBedAssignmentId())
                .billType(BillMaster.BillType.valueOf(billDto.getBillType()))
                .paymentStatus(BillMaster.PaymentStatus.UNPAID)
                .totalAmount(BigDecimal.ZERO)
                .discountAmount(billDto.getDiscountAmount() != null ? billDto.getDiscountAmount() : BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .netAmount(BigDecimal.ZERO)
                .paidAmount(BigDecimal.ZERO)
                .balanceAmount(BigDecimal.ZERO)
                .insuranceClaimAmount(billDto.getInsuranceClaimAmount() != null ? billDto.getInsuranceClaimAmount() : BigDecimal.ZERO)
                .discharged(false)
                .createdBy(billDto.getCreatedBy())
                .notes(billDto.getNotes())
                .build();

        BillMaster savedBill = billMasterRepository.save(billMaster);

        // Add bill items
        if (billDto.getBillItems() != null && !billDto.getBillItems().isEmpty()) {
            for (BillItemDto itemDto : billDto.getBillItems()) {
                addBillItem(savedBill.getBillId(), itemDto);
            }
        }

        // Recalculate totals
        recalculateBillTotals(savedBill.getBillId());

        // Send notification
        if (notificationService != null) {
            notificationService.sendBillCreatedNotification(billDto.getPatientId(), billNumber);
        }

        log.info("Bill created: {}", billNumber);
        return convertToDto(billMasterRepository.findById(savedBill.getBillId()).get());
    }

    @Transactional
    public void addBillItem(Long billId, BillItemDto itemDto) {
        BillMaster billMaster = billMasterRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        BigDecimal totalPrice = itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
        BigDecimal discountAmount = totalPrice.multiply(itemDto.getDiscountPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal taxAmount = totalPrice.subtract(discountAmount).multiply(itemDto.getTaxPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal netPrice = totalPrice.subtract(discountAmount).add(taxAmount);

        BillItem billItem = BillItem.builder()
                .billMaster(billMaster)
                .itemType(BillItem.ItemType.valueOf(itemDto.getItemType()))
                .itemName(itemDto.getItemName())
                .description(itemDto.getDescription())
                .quantity(itemDto.getQuantity())
                .unitPrice(itemDto.getUnitPrice())
                .totalPrice(totalPrice)
                .discountPercent(itemDto.getDiscountPercent())
                .taxPercent(itemDto.getTaxPercent())
                .netPrice(netPrice)
                .build();

        billItemRepository.save(billItem);
        recalculateBillTotals(billId);
    }

    @Transactional
    public void recalculateBillTotals(Long billId) {
        BillMaster bill = billMasterRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        List<BillItem> items = billItemRepository.findByBillMaster_BillId(billId);

        BigDecimal totalAmount = items.stream()
                .map(BillItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal taxAmount = items.stream()
                .map(item -> item.getTotalPrice().subtract(item.getTotalPrice().multiply(item.getDiscountPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                        .multiply(item.getTaxPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netAmount = items.stream()
                .map(BillItem::getNetPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        netAmount = netAmount.subtract(bill.getDiscountAmount());
        BigDecimal balanceAmount = netAmount.subtract(bill.getPaidAmount());

        bill.setTotalAmount(totalAmount);
        bill.setTaxAmount(taxAmount);
        bill.setNetAmount(netAmount);
        bill.setBalanceAmount(balanceAmount);

        billMasterRepository.save(bill);
    }

    @Transactional
    public PaymentTransactionDto recordPayment(PaymentTransactionDto paymentDto) {
        BillMaster bill = billMasterRepository.findById(paymentDto.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        String transactionNumber = generateTransactionNumber();

        PaymentTransaction payment = PaymentTransaction.builder()
                .billId(paymentDto.getBillId())
                .transactionNumber(transactionNumber)
                .amount(paymentDto.getAmount())
                .paymentMode(PaymentTransaction.PaymentMode.valueOf(paymentDto.getPaymentMode()))
                .paymentStatus(PaymentTransaction.PaymentStatus.SUCCESS)
                .referenceNumber(paymentDto.getReferenceNumber())
                .cardType(paymentDto.getCardType())
                .cardLast4(paymentDto.getCardLast4())
                .upiId(paymentDto.getUpiId())
                .bankName(paymentDto.getBankName())
                .chequeNumber(paymentDto.getChequeNumber())
                .chequeDate(paymentDto.getChequeDate())
                .receivedBy(paymentDto.getReceivedBy())
                .notes(paymentDto.getNotes())
                .build();

        PaymentTransaction savedPayment = paymentTransactionRepository.save(payment);

        // Update bill payment status
        bill.setPaidAmount(bill.getPaidAmount().add(paymentDto.getAmount()));
        bill.setBalanceAmount(bill.getNetAmount().subtract(bill.getPaidAmount()));

        if (bill.getBalanceAmount().compareTo(BigDecimal.ZERO) == 0) {
            bill.setPaymentStatus(BillMaster.PaymentStatus.PAID);
        } else if (bill.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            bill.setPaymentStatus(BillMaster.PaymentStatus.PARTIAL);
        }

        billMasterRepository.save(bill);

        log.info("Payment recorded: {} for bill: {}", transactionNumber, bill.getBillNumber());

        paymentDto.setTransactionId(savedPayment.getTransactionId());
        paymentDto.setTransactionNumber(transactionNumber);
        return paymentDto;
    }

    public BillDto getBillById(Long billId) {
        BillMaster bill = billMasterRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        return convertToDto(bill);
    }

    public List<BillDto> getBillsByPatientId(Long patientId) {
        return billMasterRepository.findByPatientIdOrderByBillDateDesc(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private BillDto convertToDto(BillMaster bill) {
        List<BillItemDto> items = billItemRepository.findByBillMaster_BillId(bill.getBillId()).stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList());

        return BillDto.builder()
                .billId(bill.getBillId())
                .billNumber(bill.getBillNumber())
                .patientId(bill.getPatientId())
                .appointmentId(bill.getAppointmentId())
                .bedAssignmentId(bill.getBedAssignmentId())
                .billDate(bill.getBillDate())
                .totalAmount(bill.getTotalAmount())
                .discountAmount(bill.getDiscountAmount())
                .taxAmount(bill.getTaxAmount())
                .netAmount(bill.getNetAmount())
                .paidAmount(bill.getPaidAmount())
                .balanceAmount(bill.getBalanceAmount())
                .paymentStatus(bill.getPaymentStatus().name())
                .billType(bill.getBillType().name())
                .insuranceClaimAmount(bill.getInsuranceClaimAmount())
                .discharged(bill.getDischarged())
                .dischargeDate(bill.getDischargeDate())
                .createdBy(bill.getCreatedBy())
                .notes(bill.getNotes())
                .billItems(items)
                .build();
    }

    private BillItemDto convertItemToDto(BillItem item) {
        return BillItemDto.builder()
                .itemId(item.getItemId())
                .itemType(item.getItemType().name())
                .itemName(item.getItemName())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .discountPercent(item.getDiscountPercent())
                .taxPercent(item.getTaxPercent())
                .netPrice(item.getNetPrice())
                .build();
    }

    private String generateBillNumber(String billType) {
        String prefix = billType.substring(0, Math.min(3, billType.length()));
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return prefix + "-" + timestamp;
    }

    private String generateTransactionNumber() {
        return "TXN-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
}

