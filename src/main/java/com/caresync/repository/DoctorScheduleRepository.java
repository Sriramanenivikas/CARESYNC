package com.caresync.repository;

import com.caresync.entity.DoctorSchedule;
import com.caresync.entity.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {

    List<DoctorSchedule> findByDoctorId(Long doctorId);

    Optional<DoctorSchedule> findByDoctorIdAndDayOfWeek(Long doctorId, DayOfWeek dayOfWeek);

    List<DoctorSchedule> findByDoctorIdAndIsAvailableTrue(Long doctorId);

    @Query("SELECT ds FROM DoctorSchedule ds WHERE ds.doctor.id = :doctorId AND ds.isAvailable = true ORDER BY ds.dayOfWeek")
    List<DoctorSchedule> findAvailableSchedulesByDoctor(@Param("doctorId") Long doctorId);

    void deleteByDoctorId(Long doctorId);
}
