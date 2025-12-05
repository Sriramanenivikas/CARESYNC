package com.caresync.repository;

import com.caresync.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUserId(Long userId);

    Optional<Doctor> findByLicenseNumber(String licenseNumber);

    boolean existsByLicenseNumber(String licenseNumber);

    List<Doctor> findByDepartmentId(Long departmentId);

    List<Doctor> findByIsAvailableTrue();

    List<Doctor> findBySpecialization(String specialization);

    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Doctor> searchDoctors(@Param("search") String search, Pageable pageable);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.department WHERE d.id = :id")
    Optional<Doctor> findByIdWithDepartment(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.schedules WHERE d.id = :id")
    Optional<Doctor> findByIdWithSchedules(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.appointments WHERE d.id = :id")
    Optional<Doctor> findByIdWithAppointments(@Param("id") Long id);

    @Query("SELECT COUNT(d) FROM Doctor d")
    long countAllDoctors();

    @Query("SELECT COUNT(d) FROM Doctor d WHERE d.isAvailable = true")
    long countAvailableDoctors();

    @Query("SELECT d.specialization, COUNT(d) FROM Doctor d GROUP BY d.specialization")
    List<Object[]> countBySpecialization();

    @Query("SELECT d FROM Doctor d WHERE d.department.id = :deptId AND d.isAvailable = true")
    List<Doctor> findAvailableDoctorsByDepartment(@Param("deptId") Long departmentId);
}
