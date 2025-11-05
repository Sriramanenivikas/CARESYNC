package DATAJPA.Repository;

import DATAJPA.Entity.BillMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillMasterRepository extends JpaRepository<BillMaster, Long> {

    Optional<BillMaster> findByBillNumber(String billNumber);

    List<BillMaster> findByPatientId(Long patientId);

    List<BillMaster> findByPaymentStatus(BillMaster.PaymentStatus paymentStatus);

    List<BillMaster> findByBillDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT b FROM BillMaster b WHERE b.patientId = :patientId ORDER BY b.billDate DESC")
    List<BillMaster> findByPatientIdOrderByBillDateDesc(Long patientId);

    Optional<BillMaster> findByAppointmentId(Long appointmentId);

    Optional<BillMaster> findByBedAssignmentId(Long bedAssignmentId);

    // Dashboard query methods
    long countByPaymentStatus(String paymentStatus);

    long countByPatientIdAndPaymentStatus(Long patientId, String paymentStatus);

    long countByPatientId(Long patientId);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM BillMaster b")
    Double sumTotalAmount();
}
