package com.caresync.repository;

import com.caresync.entity.Bill;
import com.caresync.entity.BillStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByPatientId(Long patientId);

    Optional<Bill> findByBillNumber(String billNumber);

    Optional<Bill> findByAppointmentId(Long appointmentId);

    List<Bill> findByStatus(BillStatus status);

    Page<Bill> findByPatientId(Long patientId, Pageable pageable);

    Page<Bill> findByStatus(BillStatus status, Pageable pageable);

    @Query("SELECT b FROM Bill b LEFT JOIN FETCH b.items WHERE b.id = :id")
    Optional<Bill> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT b FROM Bill b LEFT JOIN FETCH b.patient WHERE b.id = :id")
    Optional<Bill> findByIdWithPatient(@Param("id") Long id);

    @Query("SELECT b FROM Bill b WHERE b.status IN ('PENDING', 'PARTIAL') ORDER BY b.dueDate")
    List<Bill> findPendingBills();

    @Query("SELECT b FROM Bill b WHERE b.status IN ('PENDING', 'PARTIAL') AND b.patient.id = :patientId")
    List<Bill> findPendingBillsByPatient(@Param("patientId") Long patientId);

    @Query("SELECT COUNT(b) FROM Bill b WHERE b.status = :status")
    long countByStatus(@Param("status") BillStatus status);

    @Query("SELECT SUM(b.finalAmount) FROM Bill b")
    BigDecimal sumTotalAmount();

    @Query("SELECT SUM(b.paidAmount) FROM Bill b")
    BigDecimal sumPaidAmount();

    @Query("SELECT SUM(b.finalAmount) - SUM(b.paidAmount) FROM Bill b")
    BigDecimal sumOutstandingAmount();

    @Query("SELECT SUM(b.paidAmount) FROM Bill b WHERE b.paymentDate >= :startDate AND b.paymentDate < :endDate")
    BigDecimal sumRevenueBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b.status, COUNT(b) FROM Bill b GROUP BY b.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT b.paymentMethod, SUM(b.paidAmount) FROM Bill b WHERE b.paymentMethod IS NOT NULL GROUP BY b.paymentMethod")
    List<Object[]> sumByPaymentMethod();

    boolean existsByBillNumber(String billNumber);
}
