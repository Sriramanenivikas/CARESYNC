package com.caresync.service.impl;

import com.caresync.dto.BillDTO;
import com.caresync.dto.BillItemDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.dto.PaymentDTO;
import com.caresync.entity.*;
import com.caresync.exception.BadRequestException;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.*;
import com.caresync.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;
    private final BillItemRepository billItemRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BillDTO> getAllBills(Pageable pageable) {
        Page<Bill> page = billRepository.findAll(pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public BillDTO getBillById(Long id) {
        Bill bill = billRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
        return mapToDTO(bill);
    }

    @Override
    @Transactional(readOnly = true)
    public BillDTO getBillByNumber(String billNumber) {
        Bill bill = billRepository.findByBillNumber(billNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "billNumber", billNumber));
        return mapToDTO(bill);
    }

    @Override
    public BillDTO createBill(BillDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", dto.getPatientId()));

        Bill bill = Bill.builder()
                .patient(patient)
                .billNumber(dto.getBillNumber() != null ? dto.getBillNumber() : generateBillNumber())
                .totalAmount(dto.getTotalAmount() != null ? dto.getTotalAmount() : BigDecimal.ZERO)
                .discountAmount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : BigDecimal.ZERO)
                .taxAmount(dto.getTaxAmount() != null ? dto.getTaxAmount() : BigDecimal.ZERO)
                .finalAmount(dto.getFinalAmount() != null ? dto.getFinalAmount() : BigDecimal.ZERO)
                .paidAmount(dto.getPaidAmount() != null ? dto.getPaidAmount() : BigDecimal.ZERO)
                .status(BillStatus.PENDING)
                .dueDate(dto.getDueDate() != null ? dto.getDueDate() : LocalDate.now().plusDays(30))
                .notes(dto.getNotes())
                .build();

        // Link to appointment if provided
        if (dto.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", dto.getAppointmentId()));
            bill.setAppointment(appointment);
        }

        Bill saved = billRepository.save(bill);

        // Add bill items and calculate totals
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            BigDecimal calculatedTotal = BigDecimal.ZERO;
            for (BillItemDTO itemDTO : dto.getItems()) {
                BillItem item = BillItem.builder()
                        .bill(saved)
                        .description(itemDTO.getDescription())
                        .quantity(itemDTO.getQuantity() != null ? itemDTO.getQuantity() : 1)
                        .unitPrice(itemDTO.getUnitPrice())
                        .totalPrice(itemDTO.getTotalPrice())
                        .build();
                billItemRepository.save(item);
                calculatedTotal = calculatedTotal.add(item.getTotalPrice());
            }
            // Update totals based on items
            saved.setTotalAmount(calculatedTotal);
            saved.setFinalAmount(calculatedTotal.subtract(saved.getDiscountAmount()).add(saved.getTaxAmount()));
            billRepository.save(saved);
        }

        return getBillById(saved.getId());
    }

    @Override
    public BillDTO updateBill(Long id, BillDTO dto) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));

        bill.setDiscountAmount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : bill.getDiscountAmount());
        bill.setTaxAmount(dto.getTaxAmount() != null ? dto.getTaxAmount() : bill.getTaxAmount());
        bill.setDueDate(dto.getDueDate());
        bill.setNotes(dto.getNotes());

        // Update items - clear and re-add
        billItemRepository.deleteByBillId(id);

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (BillItemDTO itemDTO : dto.getItems()) {
                BillItem item = BillItem.builder()
                        .bill(bill)
                        .description(itemDTO.getDescription())
                        .quantity(itemDTO.getQuantity() != null ? itemDTO.getQuantity() : 1)
                        .unitPrice(itemDTO.getUnitPrice())
                        .totalPrice(itemDTO.getTotalPrice())
                        .build();
                billItemRepository.save(item);
                calculatedTotal = calculatedTotal.add(item.getTotalPrice());
            }
        }

        // Recalculate totals
        bill.setTotalAmount(calculatedTotal);
        bill.setFinalAmount(calculatedTotal.subtract(bill.getDiscountAmount()).add(bill.getTaxAmount()));
        billRepository.save(bill);

        return getBillById(id);
    }

    @Override
    public void deleteBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
        billRepository.delete(bill);
    }

    @Override
    public BillDTO updateStatus(Long id, BillStatus status) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
        
        bill.setStatus(status);
        if (status == BillStatus.PAID) {
            bill.setPaidAmount(bill.getFinalAmount());
            bill.setPaymentDate(LocalDateTime.now());
        }
        
        Bill updated = billRepository.save(bill);
        return mapToDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BillDTO> getBillsByPatient(Long patientId, Pageable pageable) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient", "id", patientId);
        }
        Page<Bill> page = billRepository.findByPatientId(patientId, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillDTO> getPendingBillsByPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient", "id", patientId);
        }
        return billRepository.findPendingBillsByPatient(patientId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BillDTO> getBillsByStatus(BillStatus status, Pageable pageable) {
        Page<Bill> page = billRepository.findByStatus(status, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillDTO> getPendingBills() {
        return billRepository.findPendingBills().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BillDTO processPayment(PaymentDTO paymentDTO) {
        Bill bill = billRepository.findById(paymentDTO.getBillId())
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", paymentDTO.getBillId()));

        if (bill.getStatus() == BillStatus.PAID) {
            throw new BadRequestException("Bill is already fully paid");
        }

        if (bill.getStatus() == BillStatus.CANCELLED) {
            throw new BadRequestException("Cannot process payment for cancelled bill");
        }

        BigDecimal newPaidAmount = bill.getPaidAmount().add(paymentDTO.getAmount());
        
        if (newPaidAmount.compareTo(bill.getFinalAmount()) > 0) {
            throw new BadRequestException("Payment amount exceeds balance due");
        }

        bill.setPaidAmount(newPaidAmount);
        bill.setPaymentMethod(paymentDTO.getPaymentMethod());
        bill.setPaymentDate(LocalDateTime.now());

        // Update status
        if (newPaidAmount.compareTo(bill.getFinalAmount()) >= 0) {
            bill.setStatus(BillStatus.PAID);
        } else if (newPaidAmount.compareTo(BigDecimal.ZERO) > 0) {
            bill.setStatus(BillStatus.PARTIAL);
        }

        if (paymentDTO.getNotes() != null) {
            String existingNotes = bill.getNotes() != null ? bill.getNotes() + "\n" : "";
            bill.setNotes(existingNotes + "Payment: " + paymentDTO.getNotes());
        }

        Bill updated = billRepository.save(bill);
        return mapToDTO(updated);
    }

    @Override
    public String generateBillNumber() {
        String prefix = "BILL-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        // Use timestamp + random to avoid collisions
        long timestamp = System.currentTimeMillis() % 100000;
        int random = (int) (Math.random() * 1000);
        return prefix + "-" + String.format("%05d%03d", timestamp, random);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(BillStatus status) {
        return billRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalRevenue() {
        BigDecimal revenue = billRepository.sumPaidAmount();
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getOutstandingAmount() {
        BigDecimal outstanding = billRepository.sumOutstandingAmount();
        return outstanding != null ? outstanding : BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTodayRevenue() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();
        BigDecimal revenue = billRepository.sumRevenueBetweenDates(startOfDay, startOfNextDay);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getMonthlyRevenue() {
        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate firstOfNextMonth = firstOfMonth.plusMonths(1);
        BigDecimal revenue = billRepository.sumRevenueBetweenDates(firstOfMonth.atStartOfDay(), firstOfNextMonth.atStartOfDay());
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    // Helper methods
    private PagedResponse<BillDTO> buildPagedResponse(Page<Bill> page) {
        List<BillDTO> content = page.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<BillDTO>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private BillDTO mapToDTO(Bill bill) {
        Patient patient = bill.getPatient();
        
        // Create a minimal PatientDTO for frontend compatibility
        com.caresync.dto.PatientDTO patientDTO = com.caresync.dto.PatientDTO.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .build();
        
        BillDTO dto = BillDTO.builder()
                .id(bill.getId())
                .patientId(patient.getId())
                .patientName(patient.getFullName())
                .patientPhone(patient.getPhone())
                .patient(patientDTO)
                .appointmentId(bill.getAppointment() != null ? bill.getAppointment().getId() : null)
                .billNumber(bill.getBillNumber())
                .totalAmount(bill.getTotalAmount())
                .discountAmount(bill.getDiscountAmount())
                .taxAmount(bill.getTaxAmount())
                .finalAmount(bill.getFinalAmount())
                .paidAmount(bill.getPaidAmount())
                .balanceDue(bill.getBalanceDue())
                .status(bill.getStatus())
                .paymentMethod(bill.getPaymentMethod())
                .paymentDate(bill.getPaymentDate())
                .dueDate(bill.getDueDate())
                .notes(bill.getNotes())
                .createdAt(bill.getCreatedAt())
                .updatedAt(bill.getUpdatedAt())
                .build();

        // Add items if loaded
        if (bill.getItems() != null && !bill.getItems().isEmpty()) {
            dto.setItems(bill.getItems().stream()
                    .map(this::mapItemToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private BillItemDTO mapItemToDTO(BillItem item) {
        return BillItemDTO.builder()
                .id(item.getId())
                .billId(item.getBill().getId())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
