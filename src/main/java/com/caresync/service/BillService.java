package com.caresync.service;

import com.caresync.dto.BillDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.dto.PaymentDTO;
import com.caresync.entity.BillStatus;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for Billing operations
 */
public interface BillService {
    
    PagedResponse<BillDTO> getAllBills(Pageable pageable);
    
    BillDTO getBillById(Long id);
    
    BillDTO getBillByNumber(String billNumber);
    
    BillDTO createBill(BillDTO billDTO);
    
    BillDTO updateBill(Long id, BillDTO billDTO);
    
    void deleteBill(Long id);
    
    // Update status
    BillDTO updateStatus(Long id, BillStatus status);
    
    // By patient
    PagedResponse<BillDTO> getBillsByPatient(Long patientId, Pageable pageable);
    
    List<BillDTO> getPendingBillsByPatient(Long patientId);
    
    // By status
    PagedResponse<BillDTO> getBillsByStatus(BillStatus status, Pageable pageable);
    
    List<BillDTO> getPendingBills();
    
    // Payment
    BillDTO processPayment(PaymentDTO paymentDTO);
    
    // Generate bill number
    String generateBillNumber();
    
    // Statistics
    long countByStatus(BillStatus status);
    
    BigDecimal getTotalRevenue();
    
    BigDecimal getOutstandingAmount();
    
    BigDecimal getTodayRevenue();
    
    BigDecimal getMonthlyRevenue();
}
