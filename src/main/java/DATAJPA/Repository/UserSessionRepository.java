package DATAJPA.Repository;

import DATAJPA.Entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    Optional<UserSession> findByJwtTokenAndIsActiveTrue(String jwtToken);

    List<UserSession> findByUserIdAndIsActiveTrue(Long userId);

    void deleteByUserIdAndIsActiveTrue(Long userId);
}

