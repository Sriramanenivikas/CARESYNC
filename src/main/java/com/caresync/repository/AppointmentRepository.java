package com.caresync.repository;

import com.caresync.entity.Appointment;
import com.caresync.entity.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByAppointmentDate(LocalDate date);

    List<Appointment> findByStatus(AppointmentStatus status);

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.appointmentDate = :date")
    List<Appointment> findByPatientIdAndDate(@Param("patientId") Long patientId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = CURRENT_DATE ORDER BY a.appointmentTime")
    List<Appointment> findTodaysAppointments();

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = CURRENT_DATE ORDER BY a.appointmentTime")
    List<Appointment> findTodaysAppointmentsByDoctor(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE " +
           "a.doctor.id = :doctorId AND " +
           "a.appointmentDate = :date AND " +
           "a.appointmentTime = :time AND " +
           "a.status != 'CANCELLED'")
    Optional<Appointment> findConflictingAppointment(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("time") LocalTime time);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.patient LEFT JOIN FETCH a.doctor WHERE a.id = :id")
    Optional<Appointment> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    long countByStatus(@Param("status") AppointmentStatus status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = CURRENT_DATE")
    long countTodaysAppointments();

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = CURRENT_DATE")
    long countTodaysAppointmentsByDoctor(@Param("doctorId") Long doctorId);

    @Query("SELECT a.status, COUNT(a) FROM Appointment a GROUP BY a.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findAppointmentsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findDoctorAppointmentsBetweenDates(
            @Param("doctorId") Long doctorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
