package com.caresync.service.impl;

import com.caresync.dto.DoctorDTO;
import com.caresync.dto.DoctorScheduleDTO;
import com.caresync.dto.PagedResponse;
import com.caresync.entity.Department;
import com.caresync.entity.Doctor;
import com.caresync.entity.DoctorSchedule;
import com.caresync.exception.BadRequestException;
import com.caresync.exception.DuplicateResourceException;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.DepartmentRepository;
import com.caresync.repository.DoctorRepository;
import com.caresync.repository.DoctorScheduleRepository;
import com.caresync.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorScheduleRepository scheduleRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DoctorDTO> getAllDoctors(Pageable pageable) {
        Page<Doctor> page = doctorRepository.findAll(pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DoctorDTO> searchDoctors(String search, Pageable pageable) {
        Page<Doctor> page = doctorRepository.searchDoctors(search, pageable);
        return buildPagedResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findByIdWithDepartment(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        return mapToDTO(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorDTO getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "userId", userId));
        return mapToDTO(doctor);
    }

    @Override
    public DoctorDTO createDoctor(DoctorDTO dto) {
        if (doctorRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            throw new DuplicateResourceException("Doctor", "licenseNumber", dto.getLicenseNumber());
        }

        Doctor doctor = Doctor.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .specialization(dto.getSpecialization())
                .qualification(dto.getQualification())
                .licenseNumber(dto.getLicenseNumber())
                .experienceYears(dto.getExperienceYears() != null ? dto.getExperienceYears() : 0)
                .consultationFee(dto.getConsultationFee())
                .bio(dto.getBio())
                .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                .build();

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));
            doctor.setDepartment(department);
        }

        Doctor saved = doctorRepository.save(doctor);
        return mapToDTO(saved);
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));

        // Check for duplicate license (excluding current)
        doctorRepository.findByLicenseNumber(dto.getLicenseNumber())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new DuplicateResourceException("Doctor", "licenseNumber", dto.getLicenseNumber());
                    }
                });

        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setBio(dto.getBio());
        if (dto.getIsAvailable() != null) {
            doctor.setIsAvailable(dto.getIsAvailable());
        }

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));
            doctor.setDepartment(department);
        }

        Doctor updated = doctorRepository.save(doctor);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        doctorRepository.delete(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> getAvailableDoctors() {
        return doctorRepository.findByIsAvailableTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Schedule operations
    @Override
    @Transactional(readOnly = true)
    public List<DoctorScheduleDTO> getDoctorSchedules(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        return scheduleRepository.findByDoctorId(doctorId).stream()
                .map(this::mapScheduleToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorScheduleDTO addDoctorSchedule(Long doctorId, DoctorScheduleDTO dto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        // Check if schedule already exists for this day
        scheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dto.getDayOfWeek())
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("Schedule already exists for " + dto.getDayOfWeek());
                });

        if (dto.getEndTime().isBefore(dto.getStartTime()) || dto.getEndTime().equals(dto.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        DoctorSchedule schedule = DoctorSchedule.builder()
                .doctor(doctor)
                .dayOfWeek(dto.getDayOfWeek())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .slotDurationMinutes(dto.getSlotDurationMinutes() != null ? dto.getSlotDurationMinutes() : 30)
                .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                .build();

        DoctorSchedule saved = scheduleRepository.save(schedule);
        return mapScheduleToDTO(saved);
    }

    @Override
    public DoctorScheduleDTO updateDoctorSchedule(Long doctorId, Long scheduleId, DoctorScheduleDTO dto) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }

        DoctorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", scheduleId));

        if (!schedule.getDoctor().getId().equals(doctorId)) {
            throw new BadRequestException("Schedule does not belong to this doctor");
        }

        if (dto.getEndTime().isBefore(dto.getStartTime()) || dto.getEndTime().equals(dto.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        schedule.setDayOfWeek(dto.getDayOfWeek());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setSlotDurationMinutes(dto.getSlotDurationMinutes());
        if (dto.getIsAvailable() != null) {
            schedule.setIsAvailable(dto.getIsAvailable());
        }

        DoctorSchedule updated = scheduleRepository.save(schedule);
        return mapScheduleToDTO(updated);
    }

    @Override
    public void deleteDoctorSchedule(Long doctorId, Long scheduleId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }

        DoctorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", scheduleId));

        if (!schedule.getDoctor().getId().equals(doctorId)) {
            throw new BadRequestException("Schedule does not belong to this doctor");
        }

        scheduleRepository.delete(schedule);
    }

    @Override
    public void toggleDoctorAvailability(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        doctor.setIsAvailable(!doctor.getIsAvailable());
        doctorRepository.save(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public long countAllDoctors() {
        return doctorRepository.countAllDoctors();
    }

    @Override
    @Transactional(readOnly = true)
    public long countAvailableDoctors() {
        return doctorRepository.countAvailableDoctors();
    }

    // Helper methods
    private PagedResponse<DoctorDTO> buildPagedResponse(Page<Doctor> page) {
        List<DoctorDTO> content = page.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<DoctorDTO>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private DoctorDTO mapToDTO(Doctor doctor) {
        DoctorDTO dto = DoctorDTO.builder()
                .id(doctor.getId())
                .userId(doctor.getUser() != null ? doctor.getUser().getId() : null)
                .departmentId(doctor.getDepartment() != null ? doctor.getDepartment().getId() : null)
                .departmentName(doctor.getDepartment() != null ? doctor.getDepartment().getName() : null)
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .licenseNumber(doctor.getLicenseNumber())
                .experienceYears(doctor.getExperienceYears())
                .consultationFee(doctor.getConsultationFee())
                .bio(doctor.getBio())
                .isAvailable(doctor.getIsAvailable())
                .createdAt(doctor.getCreatedAt())
                .updatedAt(doctor.getUpdatedAt())
                .build();

        // Add schedules if loaded
        if (doctor.getSchedules() != null && !doctor.getSchedules().isEmpty()) {
            dto.setSchedules(doctor.getSchedules().stream()
                    .map(this::mapScheduleToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private DoctorScheduleDTO mapScheduleToDTO(DoctorSchedule schedule) {
        return DoctorScheduleDTO.builder()
                .id(schedule.getId())
                .doctorId(schedule.getDoctor().getId())
                .dayOfWeek(schedule.getDayOfWeek())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .slotDurationMinutes(schedule.getSlotDurationMinutes())
                .isAvailable(schedule.getIsAvailable())
                .build();
    }
}
