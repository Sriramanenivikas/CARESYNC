package DATAJPA.Repository;

import DATAJPA.Entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByUserIdAndOtpCodeAndIsVerifiedFalseAndExpiresAtAfter(
            Long userId, String otpCode, LocalDateTime now);

    Optional<OtpVerification> findByEmailAndOtpCodeAndIsVerifiedFalseAndExpiresAtAfter(
            String email, String otpCode, LocalDateTime now);

    Optional<OtpVerification> findByMobileAndOtpCodeAndIsVerifiedFalseAndExpiresAtAfter(
            String mobile, String otpCode, LocalDateTime now);

    Optional<OtpVerification> findTopByUserIdAndOtpTypeOrderByCreatedAtDesc(
            Long userId, OtpVerification.OtpType otpType);
}

