package DATAJPA.Service.impl;

import DATAJPA.Dto.AppointmentDto;
import DATAJPA.Dto.BloodGroupCountDto;
import DATAJPA.Dto.PatientDetailDto;
import DATAJPA.Dto.PatientDto;
import DATAJPA.Entity.Patient;
import DATAJPA.Exception.ResourceNotFoundException;
import DATAJPA.Repository.PatientRepository;
import DATAJPA.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientDto> getAllPatientsOptimized() {
        List<Object[]> results = patientRepository.findAllPatientsOptimized();
        return results.stream()
                .map(this::mapToPatientDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PatientDto> getAllPatientsPaginated(Pageable pageable) {
        Page<Object[]> results = patientRepository.findAllPatientsOptimized(pageable);
        return results.map(this::mapToPatientDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Patient getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        // Force initialization of lazy-loaded collections
        if (patient.getAppointments() != null) {
            patient.getAppointments().size(); // Initialize appointments
        }
        if (patient.getEmergencyContacts() != null) {
            patient.getEmergencyContacts().size(); // Initialize emergency contacts
        }
        return patient;
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDetailDto getPatientDetailById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));

        // Force initialization
        if (patient.getAppointments() != null) {
            patient.getAppointments().size();
        }
        if (patient.getEmergencyContacts() != null) {
            patient.getEmergencyContacts().size();
        }

        return mapToPatientDetailDto(patient);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }

    @Override
    public Patient updatePatient(Patient patientDetails, Long id) {
        Patient patient = getPatientById(id);

        patient.setFirstName(patientDetails.getFirstName());
        patient.setLastName(patientDetails.getLastName());
        patient.setEmail(patientDetails.getEmail());
        patient.setGender(patientDetails.getGender());
        patient.setBloodGroup(patientDetails.getBloodGroup());
        patient.setDateOfBirth(patientDetails.getDateOfBirth());
        patient.setPhonePrimary(patientDetails.getPhonePrimary());
        patient.setPhoneSecondary(patientDetails.getPhoneSecondary());
        patient.setAddressLine1(patientDetails.getAddressLine1());
        patient.setAddressLine2(patientDetails.getAddressLine2());
        patient.setCity(patientDetails.getCity());
        patient.setState(patientDetails.getState());
        patient.setPostalCode(patientDetails.getPostalCode());
        patient.setCountry(patientDetails.getCountry());
        patient.setMaritalStatus(patientDetails.getMaritalStatus());
        patient.setOccupation(patientDetails.getOccupation());
        patient.setAllergies(patientDetails.getAllergies());
        patient.setChronicConditions(patientDetails.getChronicConditions());
        patient.setCurrentMedications(patientDetails.getCurrentMedications());

        return patientRepository.save(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodGroupCountDto> getCountsByBloodGroup() {
        return patientRepository.countPatientsByBloodGroup().stream()
                .map(row -> new BloodGroupCountDto(
                        row[0] != null ? row[0].toString() : "UNKNOWN",
                        row[1] != null ? ((Number) row[1]).longValue() : 0L
                ))
                .collect(Collectors.toList());
    }

    // Helper method to map Object[] to PatientDto
    private PatientDto mapToPatientDto(Object[] row) {
        Long id = ((Number) row[0]).longValue();
        String name = (String) row[1];
        String email = (String) row[2];
        String gender = row[3] != null ? row[3].toString() : null; // enum -> String
        String bloodGroup = row[4] != null ? row[4].toString() : null; // enum -> String
        String birthdate = row[5] != null ? row[5].toString() : null; // LocalDate -> String
        LocalDateTime createdAt = (LocalDateTime) row[6];
        Long insuranceId = row[7] != null ? ((Number) row[7]).longValue() : null;
        Integer appointmentCount = row[8] != null ? ((Number) row[8]).intValue() : 0;

        return new PatientDto(
                id,
                name,
                email,
                gender,
                bloodGroup,
                birthdate,
                createdAt,
                insuranceId,
                appointmentCount
        );
    }

    // Helper method to map Patient entity to PatientDetailDto
    private PatientDetailDto mapToPatientDetailDto(Patient patient) {
        PatientDetailDto dto = new PatientDetailDto();
        dto.setId(patient.getId());
        dto.setName(patient.getFirstName() + " " + patient.getLastName());
        dto.setEmail(patient.getEmail());
        dto.setGender(patient.getGender() != null ? patient.getGender().toString() : null);
        dto.setBloodGroup(patient.getBloodGroup() != null ? patient.getBloodGroup().toString() : null);
        dto.setBirthdate(patient.getDateOfBirth() != null ? patient.getDateOfBirth().toString() : null);
        dto.setCreatedAt(patient.getCreatedAt());

        // Note: Insurance is no longer a direct relationship from Patient
        // It would need to be queried separately if needed

        // Map appointments
        if (patient.getAppointments() != null) {
            List<AppointmentDto> appointmentDtos = patient.getAppointments().stream()
                    .map(apt -> new AppointmentDto(
                            apt.getId(),
                            apt.getAppointmentDate() + " " + apt.getAppointmentTime(),
                            apt.getDoctor() != null ?
                                apt.getDoctor().getFirstName() + " " + apt.getDoctor().getLastName() :
                                "Unknown",
                            apt.getReason()
                    ))
                    .collect(Collectors.toList());
            dto.setAppointments(appointmentDtos);
        }

        return dto;
    }
}
