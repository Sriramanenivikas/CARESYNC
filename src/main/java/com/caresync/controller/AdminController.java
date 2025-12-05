package com.caresync.controller;

import com.caresync.dto.ApiResponse;
import com.caresync.dto.PagedResponse;
import com.caresync.dto.UserDTO;
import com.caresync.entity.Role;
import com.caresync.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDTO>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<UserDTO> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO created = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", created));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {
        UserDTO updated = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String roleStr = request.get("role");
        Role role = Role.valueOf(roleStr);
        UserDTO updated = userService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updated));
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getUsersByRole(@PathVariable Role role) {
        List<UserDTO> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/users/count/{role}")
    public ResponseEntity<ApiResponse<Long>> countUsersByRole(@PathVariable Role role) {
        long count = userService.countByRole(role);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}
