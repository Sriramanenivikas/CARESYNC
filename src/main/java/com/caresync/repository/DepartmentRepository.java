package com.caresync.repository;

import com.caresync.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByName(String name);

    boolean existsByName(String name);

    List<Department> findByIsActiveTrue();

    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.doctors WHERE d.id = :id")
    Optional<Department> findByIdWithDoctors(Long id);

    @Query("SELECT COUNT(d) FROM Department d WHERE d.isActive = true")
    long countActiveDepartments();
}
