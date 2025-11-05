package DATAJPA.Service.impl;

import DATAJPA.Dto.DoctorDetailDto;
import DATAJPA.Dto.DoctorDto;
import DATAJPA.Entity.Doctor;
import DATAJPA.Repository.DoctorRepository;
import DATAJPA.Service.Doctorservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorserviceImpl implements Doctorservice {
    @Autowired
    private DoctorRepository doctorRepository;


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
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
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
}
