package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.DepartmentDTO;
import com.caresync.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentService departmentService;

    // All authenticated users can view departments
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
        List<DepartmentDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> countDepartments() {
        long count = departmentService.countAllDepartments();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getActiveDepartments() {
        List<DepartmentDTO> departments = departmentService.getActiveDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(@PathVariable Long id) {
        DepartmentDTO department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(department));
    }

    // Only ADMIN can manage departments
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(
            @Valid @RequestBody DepartmentDTO departmentDTO) {
        DepartmentDTO created = departmentService.createDepartment(departmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentDTO departmentDTO) {
        DepartmentDTO updated = departmentService.updateDepartment(id, departmentDTO);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully", null));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleDepartmentStatus(@PathVariable Long id) {
        departmentService.toggleDepartmentStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Department status toggled successfully", null));
    }
}
