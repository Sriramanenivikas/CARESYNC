package com.caresync.controller;

import com.caresync.dto.*;
import com.caresync.service.AccessCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing access codes.
 * Access codes are required for all write operations to protect hospital data.
 */
@RestController
@RequestMapping("/api/access-codes")
@RequiredArgsConstructor
@Tag(name = "Access Codes", description = "Access code management for write operations")
public class AccessCodeController {

    private final AccessCodeService accessCodeService;

    @PostMapping("/verify-admin")
    @Operation(summary = "Verify admin credentials for access code management")
    public ResponseEntity<ApiResponse<Boolean>> verifyAdmin(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        boolean valid = accessCodeService.verifyAdminCredentials(username, password);

        if (valid) {
            return ResponseEntity.ok(ApiResponse.success("Admin authenticated", true));
        } else {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid credentials"));
        }
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate a new access code (admin only)")
    public ResponseEntity<ApiResponse<AccessCodeDTO>> generateCode(
            @RequestHeader("X-Admin-User") String adminUser,
            @RequestBody CreateAccessCodeRequest request) {

        AccessCodeDTO code = accessCodeService.createAccessCode(adminUser, request);
        return ResponseEntity.ok(ApiResponse.success("Access code generated successfully", code));
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate an access code")
    public ResponseEntity<ApiResponse<Boolean>> validateCode(@RequestBody ValidateAccessCodeRequest request) {
        boolean valid = accessCodeService.validateCode(request.getCode());

        if (valid) {
            return ResponseEntity.ok(ApiResponse.success("Access code is valid", true));
        } else {
            return ResponseEntity.status(403).body(ApiResponse.error("Invalid or expired access code"));
        }
    }

    @GetMapping
    @Operation(summary = "Get all access codes (admin only)")
    public ResponseEntity<ApiResponse<List<AccessCodeDTO>>> getAllCodes() {
        List<AccessCodeDTO> codes = accessCodeService.getAllCodes();
        return ResponseEntity.ok(ApiResponse.success("Access codes retrieved", codes));
    }

    @GetMapping("/valid")
    @Operation(summary = "Get only valid (active + not expired) codes")
    public ResponseEntity<ApiResponse<List<AccessCodeDTO>>> getValidCodes() {
        List<AccessCodeDTO> codes = accessCodeService.getValidCodes();
        return ResponseEntity.ok(ApiResponse.success("Valid access codes retrieved", codes));
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate an access code")
    public ResponseEntity<ApiResponse<String>> deactivateCode(@PathVariable Long id) {
        accessCodeService.deactivateCode(id);
        return ResponseEntity.ok(ApiResponse.success("Access code deactivated", "OK"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an access code")
    public ResponseEntity<ApiResponse<String>> deleteCode(@PathVariable Long id) {
        accessCodeService.deleteCode(id);
        return ResponseEntity.ok(ApiResponse.success("Access code deleted", "OK"));
    }
}

