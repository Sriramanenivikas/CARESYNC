package DATAJPA.Repository;

import DATAJPA.Entity.StaffProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffProfileRepository extends JpaRepository<StaffProfile, Long> {

    Optional<StaffProfile> findByStaffCode(String staffCode);

    Optional<StaffProfile> findByUserId(Long userId);

    Optional<StaffProfile> findByEmail(String email);

    List<StaffProfile> findByStaffType(StaffProfile.StaffType staffType);

    List<StaffProfile> findByDepartmentId(Long departmentId);

    List<StaffProfile> findByIsActiveTrue();
}

