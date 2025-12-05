package com.caresync.repository;

import com.caresync.entity.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);

    Optional<Prescription> findByAppointmentId(Long appointmentId);

    Page<Prescription> findByPatientId(Long patientId, Pageable pageable);

    Page<Prescription> findByDoctorId(Long doctorId, Pageable pageable);

    @Query("SELECT p FROM Prescription p LEFT JOIN FETCH p.items WHERE p.id = :id")
    Optional<Prescription> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT p FROM Prescription p LEFT JOIN FETCH p.patient LEFT JOIN FETCH p.doctor WHERE p.id = :id")
    Optional<Prescription> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId ORDER BY p.createdAt DESC")
    List<Prescription> findRecentByPatient(@Param("patientId") Long patientId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Prescription p")
    long countAllPrescriptions();

    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.doctor.id = :doctorId")
    long countByDoctor(@Param("doctorId") Long doctorId);

    @Query("SELECT p FROM Prescription p WHERE p.followUpDate = :date")
    List<Prescription> findByFollowUpDate(@Param("date") LocalDate date);
}
