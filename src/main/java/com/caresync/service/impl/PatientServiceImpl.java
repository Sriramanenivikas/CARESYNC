package com.caresync.service.impl;

import com.caresync.dto.PagedResponse;
import com.caresync.dto.PatientDTO;
import com.caresync.entity.Patient;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.PatientRepository;
import com.caresync.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PatientDTO> getAllPatients(Pageable pageable) {
        Page<Patient> page = patientRepository.findAll(pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PatientDTO> searchPatients(String search, Pageable pageable) {
        Page<Patient> page = patientRepository.searchPatients(search, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        return mapToDTO(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDTO getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "userId", userId));
        return mapToDTO(patient);
    }

    @Override
    public PatientDTO createPatient(PatientDTO dto) {
        Patient patient = Patient.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .bloodGroup(dto.getBloodGroup())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .emergencyContactName(dto.getEmergencyContactName())
                .emergencyContactPhone(dto.getEmergencyContactPhone())
                .medicalHistory(dto.getMedicalHistory())
                .allergies(dto.getAllergies())
                .build();

        Patient saved = patientRepository.save(patient);
        return mapToDTO(saved);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));

        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setCity(dto.getCity());
        patient.setState(dto.getState());
        patient.setPincode(dto.getPincode());
        patient.setEmergencyContactName(dto.getEmergencyContactName());
        patient.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setAllergies(dto.getAllergies());

        Patient updated = patientRepository.save(patient);
        return mapToDTO(updated);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        patientRepository.delete(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientDTO> getPatientsByBloodGroup(String bloodGroup) {
        return patientRepository.findByBloodGroup(bloodGroup).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countAllPatients() {
        return patientRepository.countAllPatients();
    }

    // Helper methods
    private PagedResponse<PatientDTO> buildPagedResponse(Page<Patient> page) {
        List<PatientDTO> content = page.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<PatientDTO>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private PatientDTO mapToDTO(Patient patient) {
        Integer age = null;
        if (patient.getDateOfBirth() != null) {
            age = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();
        }

        return PatientDTO.builder()
                .id(patient.getId())
                .userId(patient.getUser() != null ? patient.getUser().getId() : null)
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .fullName(patient.getFullName())
                .dateOfBirth(patient.getDateOfBirth())
                .age(age)
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .phone(patient.getPhone())
                .email(patient.getEmail())
                .address(patient.getAddress())
                .city(patient.getCity())
                .state(patient.getState())
                .pincode(patient.getPincode())
                .emergencyContactName(patient.getEmergencyContactName())
                .emergencyContactPhone(patient.getEmergencyContactPhone())
                .medicalHistory(patient.getMedicalHistory())
                .allergies(patient.getAllergies())
                .createdAt(patient.getCreatedAt())
                .updatedAt(patient.getUpdatedAt())
                .build();
    }
}
