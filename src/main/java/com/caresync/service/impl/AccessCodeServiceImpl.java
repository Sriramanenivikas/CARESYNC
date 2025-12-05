package com.caresync.service.impl;

import com.caresync.dto.AccessCodeDTO;
import com.caresync.dto.CreateAccessCodeRequest;
import com.caresync.entity.AccessCode;
import com.caresync.repository.AccessCodeRepository;
import com.caresync.service.AccessCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of AccessCodeService.
 * Manages access codes for protected write operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AccessCodeServiceImpl implements AccessCodeService {

    private final AccessCodeRepository accessCodeRepository;

    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_EXPIRY_HOURS = 1;
    private static final SecureRandom random = new SecureRandom();

    @Value("${app.admin.username:#{null}}")
    private String adminUsername;

    @Value("${app.admin.password:#{null}}")
    private String adminPassword;

    @Override
    @Transactional
    public AccessCodeDTO createAccessCode(String createdBy, CreateAccessCodeRequest request) {
        String code = generateUniqueCode();

        AccessCode accessCode = AccessCode.builder()
                .code(code)
                .createdBy(createdBy)
                .note(request.getNote())
                .usageCount(0)
                .isActive(true)
                .expiresAt(LocalDateTime.now().plusHours(CODE_EXPIRY_HOURS))
                .build();

        AccessCode saved = accessCodeRepository.save(accessCode);
        log.info("Access code created by {}: {}", createdBy, code);

        return toDTO(saved);
    }

    @Override
    @Transactional
    public boolean validateCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return false;
        }

        String normalizedCode = code.toUpperCase().trim();

        return accessCodeRepository.findByCodeAndIsActiveTrue(normalizedCode)
                .map(accessCode -> {
                    if (accessCode.isExpired()) {
                        accessCode.setIsActive(false);
                        accessCodeRepository.save(accessCode);
                        log.info("Access code expired: {}", normalizedCode);
                        return false;
                    }

                    accessCode.setUsageCount(accessCode.getUsageCount() + 1);
                    accessCode.setLastUsed(LocalDateTime.now());
                    accessCodeRepository.save(accessCode);
                    log.info("Access code validated: {}", normalizedCode);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public List<AccessCodeDTO> getAllCodes() {
        return accessCodeRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccessCodeDTO> getValidCodes() {
        return accessCodeRepository.findValidCodes(LocalDateTime.now())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deactivateCode(Long id) {
        accessCodeRepository.findById(id).ifPresent(code -> {
            code.setIsActive(false);
            accessCodeRepository.save(code);
            log.info("Access code deactivated: {}", code.getCode());
        });
    }

    @Override
    @Transactional
    public void deleteCode(Long id) {
        accessCodeRepository.deleteById(id);
        log.info("Access code deleted: {}", id);
    }

    @Override
    public boolean verifyAdminCredentials(String username, String password) {
        if (adminUsername == null || adminPassword == null ||
            adminUsername.isEmpty() || adminPassword.isEmpty()) {
            log.warn("Admin credentials not configured. Set ACCESS_ADMIN_USER and ACCESS_ADMIN_PASS environment variables.");
            return false;
        }
        return adminUsername.equalsIgnoreCase(username) && adminPassword.equals(password);
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = generateCode();
        } while (accessCodeRepository.existsByCode(code));
        return code;
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 3; i++) {
            if (i > 0) sb.append("-");
            for (int j = 0; j < 4; j++) {
                sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
            }
        }
        return sb.toString();
    }

    private AccessCodeDTO toDTO(AccessCode accessCode) {
        long remainingMinutes = 0;
        if (accessCode.getExpiresAt() != null && accessCode.getIsActive()) {
            Duration duration = Duration.between(LocalDateTime.now(), accessCode.getExpiresAt());
            remainingMinutes = Math.max(0, duration.toMinutes());
        }

        return AccessCodeDTO.builder()
                .id(accessCode.getId())
                .code(accessCode.getCode())
                .createdBy(accessCode.getCreatedBy())
                .note(accessCode.getNote())
                .usageCount(accessCode.getUsageCount())
                .isActive(accessCode.getIsActive() && !accessCode.isExpired())
                .lastUsed(accessCode.getLastUsed())
                .createdAt(accessCode.getCreatedAt())
                .expiresAt(accessCode.getExpiresAt())
                .remainingMinutes(remainingMinutes)
                .build();
    }
}

