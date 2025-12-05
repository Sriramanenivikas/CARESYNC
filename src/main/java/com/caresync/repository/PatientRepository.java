package com.caresync.repository;

import com.caresync.entity.Patient;
import com.caresync.entity.Gender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByUserId(Long userId);

    Optional<Patient> findByPhone(String phone);

    Optional<Patient> findByEmail(String email);

    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Patient> searchPatients(@Param("search") String search, Pageable pageable);

    List<Patient> findByBloodGroup(String bloodGroup);

    List<Patient> findByGender(Gender gender);

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.appointments WHERE p.id = :id")
    Optional<Patient> findByIdWithAppointments(@Param("id") Long id);

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.prescriptions WHERE p.id = :id")
    Optional<Patient> findByIdWithPrescriptions(@Param("id") Long id);

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.bills WHERE p.id = :id")
    Optional<Patient> findByIdWithBills(@Param("id") Long id);

    @Query("SELECT COUNT(p) FROM Patient p")
    long countAllPatients();

    @Query("SELECT p.bloodGroup, COUNT(p) FROM Patient p WHERE p.bloodGroup IS NOT NULL GROUP BY p.bloodGroup")
    List<Object[]> countByBloodGroup();

    @Query("SELECT p.gender, COUNT(p) FROM Patient p GROUP BY p.gender")
    List<Object[]> countByGender();
}
