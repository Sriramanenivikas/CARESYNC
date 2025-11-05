package DATAJPA.Service;

import DATAJPA.Dto.DoctorDetailDto;
import DATAJPA.Dto.DoctorDto;
import DATAJPA.Entity.Doctor;

import java.util.List;

public interface Doctorservice {
    Doctor saveDoctor(Doctor doctor);

    // DTO methods to prevent lazy loading issues
    List<DoctorDto> getAllDoctorsDto();
    DoctorDetailDto getDoctorDetailDto(Long id);

    // Legacy entity methods (use with caution)
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(Long id);

    void deleteDoctor(Long id);

    Doctor updateDoctor(Doctor patient, Long id);
}
