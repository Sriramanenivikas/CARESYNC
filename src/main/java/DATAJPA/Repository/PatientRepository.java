package DATAJPA.Repository;

import DATAJPA.Entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Eagerly fetch appointments and emergency contacts to avoid lazy loading issues
    @EntityGraph(attributePaths = {"appointments", "emergencyContacts"})
    Optional<Patient> findById(Long id);

    // Eagerly fetch for all patients
    @EntityGraph(attributePaths = {"appointments"})
    List<Patient> findAll();

    // Query methods using Spring Data JPA method naming convention
    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByPatientCode(String patientCode);

    List<Patient> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);

    List<Patient> findByGender(Patient.Gender gender);

    Page<Patient> findByGender(Patient.Gender gender, Pageable pageable);

    List<Patient> findByBloodGroup(Patient.BloodGroup bloodGroup);

    // Custom JPQL queries
    @Query("SELECT p FROM Patient p WHERE p.email = :email")
    Optional<Patient> findPatientByEmail(@Param("email") String email);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Patient> searchByName(@Param("name") String name);

    @Query("SELECT p FROM Patient p WHERE p.gender = :gender AND p.bloodGroup = :bloodGroup")
    List<Patient> findByGenderAndBloodGroup(@Param("gender") Patient.Gender gender,
                                           @Param("bloodGroup") Patient.BloodGroup bloodGroup);

    @Query("SELECT p FROM Patient p WHERE p.dateOfBirth = :dateOfBirth")
    List<Patient> findByDateOfBirth(@Param("dateOfBirth") java.time.LocalDate dateOfBirth);

    @Query("SELECT p.bloodGroup, COUNT(p) FROM Patient p GROUP BY p.bloodGroup")
    List<Object[]> countPatientsByBloodGroup();

    @Modifying
    @Query(value = "UPDATE patients SET first_name = :firstName, last_name = :lastName WHERE id = :id", nativeQuery = true)
    int updatePatientNameById(@Param("firstName") String firstName, @Param("lastName") String lastName, @Param("id") Long id);

    // Pageable methods
    @Query("SELECT p FROM Patient p WHERE p.bloodGroup = :bloodGroup")
    Page<Patient> findByBloodGroupPageable(@Param("bloodGroup") Patient.BloodGroup bloodGroup, Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Patient> searchByNamePageable(@Param("name") String name, Pageable pageable);

    // Optimized query for listing patients without loading relationships
    @Query("SELECT p.id as id, CONCAT(p.firstName, ' ', p.lastName) as name, p.email as email, " +
           "p.gender as gender, p.bloodGroup as bloodGroup, p.dateOfBirth as birthdate, " +
           "p.createdAt as createdAt, null as insuranceId, SIZE(p.appointments) as appointmentCount " +
           "FROM Patient p")
    Page<Object[]> findAllPatientsOptimized(Pageable pageable);

    // For getting all without pagination (only for small datasets)
    @Query("SELECT p.id as id, CONCAT(p.firstName, ' ', p.lastName) as name, p.email as email, " +
           "p.gender as gender, p.bloodGroup as bloodGroup, p.dateOfBirth as birthdate, " +
           "p.createdAt as createdAt, null as insuranceId, SIZE(p.appointments) as appointmentCount " +
           "FROM Patient p")
    List<Object[]> findAllPatientsOptimized();

    // Dashboard query methods
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
