package DATAJPA.Repository;

import DATAJPA.Entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);

    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByPatientIdOrderByPrescriptionDateDesc(Long patientId);

    Optional<Prescription> findByAppointmentId(Long appointmentId);

    List<Prescription> findByIsDispensed(Boolean isDispensed);

    // Dashboard query methods
    long countByPatientId(Long patientId);
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    long countByIsDispensed(Boolean isDispensed);
}
