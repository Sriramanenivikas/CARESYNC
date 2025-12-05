package com.caresync.service.impl;

import com.caresync.dto.DoctorDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.dto.PatientDTO;
import com.caresync.dto.PrescriptionDTO;
import com.caresync.dto.PrescriptionItemDTO;
import com.caresync.entity.*;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.*;
import com.caresync.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PrescriptionDTO> getAllPrescriptions(Pageable pageable) {
        Page<Prescription> page = prescriptionRepository.findAll(pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDTO getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));
        return mapToDTO(prescription);
    }

    @Override
    public PrescriptionDTO createPrescription(PrescriptionDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", dto.getDoctorId()));

        Prescription prescription = Prescription.builder()
                .patient(patient)
                .doctor(doctor)
                .diagnosis(dto.getDiagnosis() != null ? dto.getDiagnosis() : dto.getMedicationName())
                .notes(dto.getNotes() != null ? dto.getNotes() : dto.getInstructions())
                .followUpDate(dto.getFollowUpDate())
                .build();

        // Link to appointment if provided
        if (dto.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", dto.getAppointmentId()));
            prescription.setAppointment(appointment);
        }

        Prescription saved = prescriptionRepository.save(prescription);

        // Add prescription items - check for flattened form data or items array
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (PrescriptionItemDTO itemDTO : dto.getItems()) {
                PrescriptionItem item = PrescriptionItem.builder()
                        .prescription(saved)
                        .medicineName(itemDTO.getMedicineName())
                        .dosage(itemDTO.getDosage())
                        .frequency(itemDTO.getFrequency())
                        .duration(itemDTO.getDuration())
                        .quantity(itemDTO.getQuantity())
                        .instructions(itemDTO.getInstructions())
                        .build();
                prescriptionItemRepository.save(item);
            }
        } else if (dto.getMedicationName() != null && !dto.getMedicationName().isEmpty()) {
            // Handle flattened form data from frontend
            PrescriptionItem item = PrescriptionItem.builder()
                    .prescription(saved)
                    .medicineName(dto.getMedicationName())
                    .dosage(dto.getDosage())
                    .frequency(dto.getFrequency())
                    .duration(dto.getDuration())
                    .quantity(1)
                    .instructions(dto.getInstructions())
                    .build();
            prescriptionItemRepository.save(item);
        }

        return getPrescriptionById(saved.getId());
    }

    @Override
    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO dto) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));

        prescription.setDiagnosis(dto.getDiagnosis() != null ? dto.getDiagnosis() : dto.getMedicationName());
        prescription.setNotes(dto.getNotes() != null ? dto.getNotes() : dto.getInstructions());
        prescription.setFollowUpDate(dto.getFollowUpDate());

        // Update items - clear and re-add
        prescriptionItemRepository.deleteByPrescriptionId(id);

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (PrescriptionItemDTO itemDTO : dto.getItems()) {
                PrescriptionItem item = PrescriptionItem.builder()
                        .prescription(prescription)
                        .medicineName(itemDTO.getMedicineName())
                        .dosage(itemDTO.getDosage())
                        .frequency(itemDTO.getFrequency())
                        .duration(itemDTO.getDuration())
                        .quantity(itemDTO.getQuantity())
                        .instructions(itemDTO.getInstructions())
                        .build();
                prescriptionItemRepository.save(item);
            }
        } else if (dto.getMedicationName() != null && !dto.getMedicationName().isEmpty()) {
            // Handle flattened form data from frontend
            PrescriptionItem item = PrescriptionItem.builder()
                    .prescription(prescription)
                    .medicineName(dto.getMedicationName())
                    .dosage(dto.getDosage())
                    .frequency(dto.getFrequency())
                    .duration(dto.getDuration())
                    .quantity(1)
                    .instructions(dto.getInstructions())
                    .build();
            prescriptionItemRepository.save(item);
        }

        prescriptionRepository.save(prescription);
        return getPrescriptionById(id);
    }

    @Override
    public void deletePrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));
        prescriptionRepository.delete(prescription);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PrescriptionDTO> getPrescriptionsByPatient(Long patientId, Pageable pageable) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient", "id", patientId);
        }
        Page<Prescription> page = prescriptionRepository.findByPatientId(patientId, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDTO> getRecentPrescriptionsByPatient(Long patientId, int limit) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient", "id", patientId);
        }
        return prescriptionRepository.findRecentByPatient(patientId, PageRequest.of(0, limit)).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PrescriptionDTO> getPrescriptionsByDoctor(Long doctorId, Pageable pageable) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        Page<Prescription> page = prescriptionRepository.findByDoctorId(doctorId, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDTO getPrescriptionByAppointment(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "appointmentId", appointmentId));
        return mapToDTO(prescription);
    }

    @Override
    @Transactional(readOnly = true)
    public long countAllPrescriptions() {
        return prescriptionRepository.countAllPrescriptions();
    }

    @Override
    @Transactional(readOnly = true)
    public long countPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.countByDoctor(doctorId);
    }

    // Helper methods
    private PagedResponse<PrescriptionDTO> buildPagedResponse(Page<Prescription> page) {
        List<PrescriptionDTO> content = page.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<PrescriptionDTO>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private PrescriptionDTO mapToDTO(Prescription prescription) {
        Patient patient = prescription.getPatient();
        Doctor doctor = prescription.getDoctor();
        
        // Create minimal PatientDTO for frontend compatibility
        PatientDTO patientDTO = PatientDTO.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .build();
        
        // Create minimal DoctorDTO for frontend compatibility
        DoctorDTO doctorDTO = DoctorDTO.builder()
                .id(doctor.getId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .build();
        
        PrescriptionDTO dto = PrescriptionDTO.builder()
                .id(prescription.getId())
                .appointmentId(prescription.getAppointment() != null ? prescription.getAppointment().getId() : null)
                .patientId(patient.getId())
                .patientName(patient.getFullName())
                .patient(patientDTO)
                .doctorId(doctor.getId())
                .doctorName(doctor.getFullName())
                .doctor(doctorDTO)
                .diagnosis(prescription.getDiagnosis())
                .notes(prescription.getNotes())
                .followUpDate(prescription.getFollowUpDate())
                .createdAt(prescription.getCreatedAt())
                .build();

        // Add items if loaded
        if (prescription.getItems() != null && !prescription.getItems().isEmpty()) {
            dto.setItems(prescription.getItems().stream()
                    .map(this::mapItemToDTO)
                    .collect(Collectors.toList()));
            
            // Flatten first item fields for frontend compatibility
            PrescriptionItem firstItem = prescription.getItems().get(0);
            dto.setMedicationName(firstItem.getMedicineName());
            dto.setDosage(firstItem.getDosage());
            dto.setFrequency(firstItem.getFrequency());
            dto.setDuration(firstItem.getDuration());
            dto.setInstructions(firstItem.getInstructions());
        }

        return dto;
    }

    private PrescriptionItemDTO mapItemToDTO(PrescriptionItem item) {
        return PrescriptionItemDTO.builder()
                .id(item.getId())
                .prescriptionId(item.getPrescription().getId())
                .medicineName(item.getMedicineName())
                .dosage(item.getDosage())
                .frequency(item.getFrequency())
                .duration(item.getDuration())
                .quantity(item.getQuantity())
                .instructions(item.getInstructions())
                .build();
    }
}
