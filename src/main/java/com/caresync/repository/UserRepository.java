package com.caresync.repository;

import com.caresync.entity.User;
import com.caresync.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findByRole(Role role);

    List<User> findByIsActiveTrue();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();
}
