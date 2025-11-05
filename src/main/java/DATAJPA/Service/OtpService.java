package DATAJPA.Service;

import DATAJPA.Dto.OtpRequestDto;
import DATAJPA.Dto.OtpVerifyDto;
import DATAJPA.Entity.OtpVerification;
import DATAJPA.Entity.User;
import DATAJPA.Repository.OtpVerificationRepository;
import DATAJPA.Repository.Userrepositary;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final Userrepositary userRepository;

    @Autowired(required = false)
    private EmailService emailService;

    @Autowired(required = false)
    private SmsService smsService;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 3;

    public OtpService(OtpVerificationRepository otpVerificationRepository, Userrepositary userRepository) {
        this.otpVerificationRepository = otpVerificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public String generateAndSendOtp(OtpRequestDto request) {
        // Find user by email or mobile
        User user = null;
        if (request.getEmail() != null) {
            user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));
        } else if (request.getUsername() != null) {
            user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + request.getUsername()));
        }

        if (user == null) {
            throw new RuntimeException("User identification required");
        }

        // Generate OTP
        String otpCode = generateOtpCode();

        // Create OTP record
        OtpVerification otpVerification = OtpVerification.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .mobile(request.getMobile())
                .otpCode(otpCode)
                .otpType(OtpVerification.OtpType.valueOf(request.getOtpType()))
                .isVerified(false)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .attempts(0)
                .build();

        otpVerificationRepository.save(otpVerification);

        // Send OTP via email or SMS
        if (user.getEmail() != null && emailService != null) {
            emailService.sendOtpEmail(user.getEmail(), otpCode);
        }
        if (request.getMobile() != null && smsService != null) {
            smsService.sendOtpSms(request.getMobile(), otpCode);
        }

        log.info("OTP generated for user: {}", user.getUsername());
        return "OTP sent successfully";
    }

    @Transactional
    public boolean verifyOtp(OtpVerifyDto verifyDto) {
        Optional<OtpVerification> otpOpt;

        if (verifyDto.getEmail() != null) {
            otpOpt = otpVerificationRepository
                    .findByEmailAndOtpCodeAndIsVerifiedFalseAndExpiresAtAfter(
                            verifyDto.getEmail(), verifyDto.getOtpCode(), LocalDateTime.now());
        } else if (verifyDto.getMobile() != null) {
            otpOpt = otpVerificationRepository
                    .findByMobileAndOtpCodeAndIsVerifiedFalseAndExpiresAtAfter(
                            verifyDto.getMobile(), verifyDto.getOtpCode(), LocalDateTime.now());
        } else {
            throw new RuntimeException("Email or mobile required for OTP verification");
        }

        if (otpOpt.isEmpty()) {
            log.warn("Invalid or expired OTP");
            return false;
        }

        OtpVerification otp = otpOpt.get();

        // Check attempts
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            log.warn("Maximum OTP attempts exceeded");
            return false;
        }

        // Mark as verified
        otp.setIsVerified(true);
        otp.setVerifiedAt(LocalDateTime.now());
        otp.setAttempts(otp.getAttempts() + 1);
        otpVerificationRepository.save(otp);

        log.info("OTP verified successfully for user: {}", otp.getUserId());
        return true;
    }

    private String generateOtpCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}

