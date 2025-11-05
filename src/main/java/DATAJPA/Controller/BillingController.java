package DATAJPA.Controller;

import DATAJPA.Dto.BillDto;
import DATAJPA.Dto.BillItemDto;
import DATAJPA.Dto.PaymentTransactionDto;
import DATAJPA.Service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/bills")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<BillDto> createBill(@Valid @RequestBody BillDto billDto) {
        BillDto created = billingService.createBill(billDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/bills/{billId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<BillDto> getBillById(@PathVariable Long billId) {
        return ResponseEntity.ok(billingService.getBillById(billId));
    }

    @GetMapping("/bills/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<List<BillDto>> getBillsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(billingService.getBillsByPatientId(patientId));
    }

    @PostMapping("/bills/{billId}/items")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Void> addBillItem(@PathVariable Long billId,
                                           @Valid @RequestBody BillItemDto billItemDto) {
        billingService.addBillItem(billId, billItemDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<PaymentTransactionDto> recordPayment(
            @Valid @RequestBody PaymentTransactionDto paymentDto) {
        PaymentTransactionDto recorded = billingService.recordPayment(paymentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(recorded);
    }
}

