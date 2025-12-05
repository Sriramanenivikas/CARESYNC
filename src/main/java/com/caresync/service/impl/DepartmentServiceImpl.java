package com.caresync.service.impl;

import com.caresync.dto.DepartmentDTO;
import com.caresync.entity.Department;
import com.caresync.exception.DuplicateResourceException;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.DepartmentRepository;
import com.caresync.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getActiveDepartments() {
        return departmentRepository.findByIsActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return mapToDTO(department);
    }

    @Override
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department", "name", dto.getName());
        }

        Department department = Department.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .floorNumber(dto.getFloorNumber())
                .phone(dto.getPhone())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Department saved = departmentRepository.save(department);
        return mapToDTO(saved);
    }

    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        // Check for duplicate name (excluding current)
        departmentRepository.findByName(dto.getName())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new DuplicateResourceException("Department", "name", dto.getName());
                    }
                });

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setFloorNumber(dto.getFloorNumber());
        department.setPhone(dto.getPhone());
        if (dto.getIsActive() != null) {
            department.setIsActive(dto.getIsActive());
        }

        Department updated = departmentRepository.save(department);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        departmentRepository.delete(department);
    }

    @Override
    public void toggleDepartmentStatus(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        department.setIsActive(!department.getIsActive());
        departmentRepository.save(department);
    }

    @Override
    @Transactional(readOnly = true)
    public long countAllDepartments() {
        return departmentRepository.count();
    }

    // Mapper method
    private DepartmentDTO mapToDTO(Department department) {
        return DepartmentDTO.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .floorNumber(department.getFloorNumber())
                .phone(department.getPhone())
                .isActive(department.getIsActive())
                .createdAt(department.getCreatedAt())
                .doctorCount(department.getDoctors() != null ? department.getDoctors().size() : 0)
                .build();
    }
}
