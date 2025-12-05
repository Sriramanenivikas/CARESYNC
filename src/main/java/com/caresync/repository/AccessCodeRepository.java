package com.caresync.repository;

import com.caresync.entity.AccessCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for AccessCode entity operations.
 */
@Repository
public interface AccessCodeRepository extends JpaRepository<AccessCode, Long> {

    Optional<AccessCode> findByCodeAndIsActiveTrue(String code);

    List<AccessCode> findByIsActiveTrueOrderByCreatedAtDesc();

    List<AccessCode> findAllByOrderByCreatedAtDesc();

    @Query("SELECT a FROM AccessCode a WHERE a.isActive = true AND a.expiresAt > :now")
    List<AccessCode> findValidCodes(LocalDateTime now);

    boolean existsByCode(String code);
}

