package DATAJPA.Repository;

import DATAJPA.Entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {

    List<LoginAttempt> findByEmailAndSuccessFalseAndAttemptedAtAfter(
            String email, LocalDateTime after);

    List<LoginAttempt> findByMobileAndSuccessFalseAndAttemptedAtAfter(
            String mobile, LocalDateTime after);
}

