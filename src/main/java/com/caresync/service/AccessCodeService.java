package com.caresync.service;

import com.caresync.dto.AccessCodeDTO;
import com.caresync.dto.CreateAccessCodeRequest;

import java.util.List;

/**
 * Service interface for access code operations.
 */
public interface AccessCodeService {

    /**
     * Generate a new access code (admin only)
     */
    AccessCodeDTO createAccessCode(String createdBy, CreateAccessCodeRequest request);

    /**
     * Validate an access code
     * Returns true if code is valid (active and not expired)
     */
    boolean validateCode(String code);

    /**
     * Get all access codes (admin only)
     */
    List<AccessCodeDTO> getAllCodes();

    /**
     * Get only valid (active + not expired) codes
     */
    List<AccessCodeDTO> getValidCodes();

    /**
     * Deactivate an access code
     */
    void deactivateCode(Long id);

    /**
     * Delete an access code
     */
    void deleteCode(Long id);

    /**
     * Verify admin credentials for access code management
     */
    boolean verifyAdminCredentials(String username, String password);
}

