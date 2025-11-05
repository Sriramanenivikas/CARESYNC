package DATAJPA.Service;

import DATAJPA.Dto.PatientDetailDto;
import DATAJPA.Dto.PatientDto;
import DATAJPA.Dto.BloodGroupCountDto;
import DATAJPA.Entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientService {
    Patient savePatient(Patient patient);

    List<Patient> getAllPatients();

    // Optimized method for listing patients (without loading relationships)
    List<PatientDto> getAllPatientsOptimized();

    // Paginated version for large datasets
    Page<PatientDto> getAllPatientsPaginated(Pageable pageable);

    Patient getPatientById(Long id);

    // Get patient with full details (for single patient view)
    PatientDetailDto getPatientDetailById(Long id);

    void deletePatient(Long id);

    Patient updatePatient(Patient patient, Long id);

    // Aggregations
    List<BloodGroupCountDto> getCountsByBloodGroup();
}
