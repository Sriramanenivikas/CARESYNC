package DATAJPA.Repository;

import DATAJPA.Entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ActivityLog> findByModuleOrderByCreatedAtDesc(String module);

    List<ActivityLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<ActivityLog> findByUserIdAndModuleOrderByCreatedAtDesc(Long userId, String module);
}

