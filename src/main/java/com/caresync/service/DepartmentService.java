package com.caresync.service;

import com.caresync.dto.DepartmentDTO;
import java.util.List;

/**
 * Service interface for Department operations
 */
public interface DepartmentService {
    
    List<DepartmentDTO> getAllDepartments();
    
    List<DepartmentDTO> getActiveDepartments();
    
    DepartmentDTO getDepartmentById(Long id);
    
    DepartmentDTO createDepartment(DepartmentDTO departmentDTO);
    
    DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO);
    
    void deleteDepartment(Long id);
    
    void toggleDepartmentStatus(Long id);
    
    long countAllDepartments();
}
