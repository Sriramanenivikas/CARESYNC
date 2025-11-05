package DATAJPA.Repository;

import DATAJPA.Entity.Insurance;
import DATAJPA.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InsuranceRepository extends JpaRepository<Insurance, Long> {

    Optional<Insurance> findByPolicyNumber(String policyNumber);

    Optional<Insurance> findByPatient(Patient patient);

    Optional<Insurance> findByPatientId(Long patientId);
}