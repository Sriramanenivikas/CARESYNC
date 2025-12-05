package com.caresync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    private Long id;
    
    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;
    
    private String description;
    private Integer floorNumber;
    private String phone;
    private Boolean isActive;
    private LocalDateTime createdAt;
    
    // Additional info
    private Integer doctorCount;
}
