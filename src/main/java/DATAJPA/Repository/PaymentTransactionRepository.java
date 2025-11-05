package DATAJPA.Repository;

import DATAJPA.Entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findByBillId(Long billId);

    Optional<PaymentTransaction> findByTransactionNumber(String transactionNumber);

    List<PaymentTransaction> findByPaymentStatus(PaymentTransaction.PaymentStatus paymentStatus);
}

