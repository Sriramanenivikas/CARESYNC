package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.BillDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.dto.PaymentDTO;
import com.caresync.entity.BillStatus;
import com.caresync.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BillController {

    private final BillService billService;

    // ADMIN, RECEPTIONIST, TEST can view all bills
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<PagedResponse<BillDTO>>> getAllBills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<BillDTO> bills = billService.getAllBills(pageable);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    // ADMIN, RECEPTIONIST, TEST can view statistics
    @GetMapping("/count/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<Long>> countByStatus(@PathVariable BillStatus status) {
        long count = billService.countByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/revenue/total")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalRevenue() {
        BigDecimal revenue = billService.getTotalRevenue();
        return ResponseEntity.ok(ApiResponse.success(revenue));
    }

    @GetMapping("/revenue/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<BigDecimal>> getTodayRevenue() {
        BigDecimal revenue = billService.getTodayRevenue();
        return ResponseEntity.ok(ApiResponse.success(revenue));
    }

    @GetMapping("/revenue/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<BigDecimal>> getMonthlyRevenue() {
        BigDecimal revenue = billService.getMonthlyRevenue();
        return ResponseEntity.ok(ApiResponse.success(revenue));
    }

    @GetMapping("/outstanding")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<BigDecimal>> getOutstandingAmount() {
        BigDecimal outstanding = billService.getOutstandingAmount();
        return ResponseEntity.ok(ApiResponse.success(outstanding));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<List<BillDTO>>> getPendingBills() {
        List<BillDTO> bills = billService.getPendingBills();
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @GetMapping("/generate-number")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<String>> generateBillNumber() {
        String billNumber = billService.generateBillNumber();
        return ResponseEntity.ok(ApiResponse.success(billNumber));
    }

    // ADMIN, RECEPTIONIST, TEST can view any; PATIENT can view own
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isBillOwner(#id)")
    public ResponseEntity<ApiResponse<BillDTO>> getBillById(@PathVariable Long id) {
        BillDTO bill = billService.getBillById(id);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }

    @GetMapping("/number/{billNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<BillDTO>> getBillByNumber(@PathVariable String billNumber) {
        BillDTO bill = billService.getBillByNumber(billNumber);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }

    // ADMIN, RECEPTIONIST, TEST can view any patient's; PATIENT can view own
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isPatientOwner(#patientId)")
    public ResponseEntity<ApiResponse<PagedResponse<BillDTO>>> getBillsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<BillDTO> bills = billService.getBillsByPatient(patientId, pageable);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @GetMapping("/patient/{patientId}/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST') or @securityService.isPatientOwner(#patientId)")
    public ResponseEntity<ApiResponse<List<BillDTO>>> getPendingBillsByPatient(@PathVariable Long patientId) {
        List<BillDTO> bills = billService.getPendingBillsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'TEST')")
    public ResponseEntity<ApiResponse<PagedResponse<BillDTO>>> getBillsByStatus(
            @PathVariable BillStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<BillDTO> bills = billService.getBillsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    // ADMIN, RECEPTIONIST can create bills
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<BillDTO>> createBill(@Valid @RequestBody BillDTO billDTO) {
        BillDTO created = billService.createBill(billDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bill created successfully", created));
    }

    // ADMIN, RECEPTIONIST can update bills
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<BillDTO>> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody BillDTO billDTO) {
        BillDTO updated = billService.updateBill(id, billDTO);
        return ResponseEntity.ok(ApiResponse.success("Bill updated successfully", updated));
    }

    // Only ADMIN can delete bills
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.ok(ApiResponse.success("Bill deleted successfully", null));
    }

    // ADMIN, RECEPTIONIST can update bill status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<BillDTO>> updateBillStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {
        String statusStr = request.get("status");
        BillStatus status = BillStatus.valueOf(statusStr);
        BillDTO updated = billService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Bill status updated successfully", updated));
    }

    // ADMIN, RECEPTIONIST can process any payment; PATIENT can pay own bills
    @PostMapping("/payment")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @securityService.isBillOwner(#paymentDTO.billId)")
    public ResponseEntity<ApiResponse<BillDTO>> processPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        BillDTO updated = billService.processPayment(paymentDTO);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", updated));
    }
}
