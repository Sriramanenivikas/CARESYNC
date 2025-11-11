package DATAJPA.Service.impl;

import DATAJPA.Dto.DoctorDetailDto;
import DATAJPA.Dto.DoctorDto;
import DATAJPA.Entity.Doctor;
import DATAJPA.Exception.ResourceNotFoundException;
import DATAJPA.Repository.DoctorRepository;
import DATAJPA.Service.Doctorservice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorserviceImpl implements Doctorservice {
    private final DoctorRepository doctorRepository;


    @Override
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctorRepository.delete(doctor);

    }

    @Override
    public Doctor updateDoctor(Doctor updatedDoctor, Long id) {
        Doctor doctor = getDoctorById(id);

        doctor.setFirstName(updatedDoctor.getFirstName());
        doctor.setLastName(updatedDoctor.getLastName());
        doctor.setEmail(updatedDoctor.getEmail());
        doctor.setGender(updatedDoctor.getGender());
        doctor.setPhonePrimary(updatedDoctor.getPhonePrimary());
        doctor.setPhoneSecondary(updatedDoctor.getPhoneSecondary());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setQualification(updatedDoctor.getQualification());
        doctor.setExperienceYears(updatedDoctor.getExperienceYears());
        doctor.setConsultationFee(updatedDoctor.getConsultationFee());
        doctor.setAvailabilityStatus(updatedDoctor.getAvailabilityStatus());

        return doctorRepository.save(doctor);

    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDto> getAllDoctorsDto() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDoctorDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorDetailDto getDoctorDetailDto(Long id) {
        Doctor doctor = getDoctorById(id);
        return mapToDoctorDetailDto(doctor);
    }

    // Helper method to map Doctor entity to DoctorDto
    private DoctorDto mapToDoctorDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .doctorCode(doctor.getDoctorCode())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .fullName(doctor.getFirstName() + " " + doctor.getLastName())
                .email(doctor.getEmail())
                .gender(doctor.getGender() != null ? doctor.getGender().toString() : null)
                .phonePrimary(doctor.getPhonePrimary())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .consultationFee(doctor.getConsultationFee())
                .availabilityStatus(doctor.getAvailabilityStatus())
                .joiningDate(doctor.getJoiningDate())
                .build();
    }

    // Helper method to map Doctor entity to DoctorDetailDto
    private DoctorDetailDto mapToDoctorDetailDto(Doctor doctor) {
        return DoctorDetailDto.builder()
                .id(doctor.getId())
                .doctorCode(doctor.getDoctorCode())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .fullName(doctor.getFirstName() + " " + doctor.getLastName())
                .email(doctor.getEmail())
                .gender(doctor.getGender() != null ? doctor.getGender().toString() : null)
                .dateOfBirth(doctor.getDateOfBirth())
                .phonePrimary(doctor.getPhonePrimary())
                .phoneSecondary(doctor.getPhoneSecondary())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .licenseNumber(doctor.getLicenseNumber())
                .experienceYears(doctor.getExperienceYears())
                .consultationFee(doctor.getConsultationFee())
                .availabilityStatus(doctor.getAvailabilityStatus())
                .joiningDate(doctor.getJoiningDate())
                // Note: Lazy collections not loaded to prevent session issues
                // Can be loaded separately if needed
                .build();
    }

    @Override
    @Transactional
    public DoctorDto saveDoctorFromDto(DoctorDto doctorDto) {
        // Map DTO to Entity (only fields that exist in entity)
        Doctor doctor = Doctor.builder()
                .doctorCode(doctorDto.getDoctorCode())
                .firstName(doctorDto.getFirstName())
                .lastName(doctorDto.getLastName())
                .email(doctorDto.getEmail())
                .gender(doctorDto.getGender() != null ? Doctor.Gender.valueOf(doctorDto.getGender()) : null)
                .dateOfBirth(doctorDto.getDateOfBirth())
                .phonePrimary(doctorDto.getPhonePrimary())
                .phoneSecondary(doctorDto.getPhoneSecondary())
                .specialization(doctorDto.getSpecialization())
                .qualification(doctorDto.getQualification())
                .licenseNumber(doctorDto.getLicenseNumber())
                .experienceYears(doctorDto.getExperienceYears())
                .joiningDate(doctorDto.getJoiningDate())
                .consultationFee(doctorDto.getConsultationFee())
                .availabilityStatus(doctorDto.getAvailabilityStatus())
                .isActive(doctorDto.getIsActive() != null ? doctorDto.getIsActive() : true)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDoctorDto(savedDoctor);
    }

    @Override
    @Transactional
    public DoctorDto updateDoctorFromDto(DoctorDto doctorDto, Long id) {
        Doctor doctor = getDoctorById(id);

        // Update only fields that exist in entity
        if (doctorDto.getDoctorCode() != null) doctor.setDoctorCode(doctorDto.getDoctorCode());
        if (doctorDto.getFirstName() != null) doctor.setFirstName(doctorDto.getFirstName());
        if (doctorDto.getLastName() != null) doctor.setLastName(doctorDto.getLastName());
        if (doctorDto.getEmail() != null) doctor.setEmail(doctorDto.getEmail());
        if (doctorDto.getGender() != null) doctor.setGender(Doctor.Gender.valueOf(doctorDto.getGender()));
        if (doctorDto.getDateOfBirth() != null) doctor.setDateOfBirth(doctorDto.getDateOfBirth());
        if (doctorDto.getPhonePrimary() != null) doctor.setPhonePrimary(doctorDto.getPhonePrimary());
        if (doctorDto.getPhoneSecondary() != null) doctor.setPhoneSecondary(doctorDto.getPhoneSecondary());
        if (doctorDto.getSpecialization() != null) doctor.setSpecialization(doctorDto.getSpecialization());
        if (doctorDto.getQualification() != null) doctor.setQualification(doctorDto.getQualification());
        if (doctorDto.getLicenseNumber() != null) doctor.setLicenseNumber(doctorDto.getLicenseNumber());
        if (doctorDto.getExperienceYears() != null) doctor.setExperienceYears(doctorDto.getExperienceYears());
        if (doctorDto.getJoiningDate() != null) doctor.setJoiningDate(doctorDto.getJoiningDate());
        if (doctorDto.getConsultationFee() != null) doctor.setConsultationFee(doctorDto.getConsultationFee());
        if (doctorDto.getAvailabilityStatus() != null) doctor.setAvailabilityStatus(doctorDto.getAvailabilityStatus());
        if (doctorDto.getIsActive() != null) doctor.setIsActive(doctorDto.getIsActive());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return mapToDoctorDto(updatedDoctor);
    }
}
