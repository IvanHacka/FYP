package org.example.jobboard.repo;

import org.example.jobboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface UserRepo extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email); // input email find user if exist (Login)
    boolean existsByEmail(String email); //check email existing (Register)
    List<User> findByRoleAndIsActive(User.Role role, Boolean isActive);


    // 1. check last active
    // 2. check if account is valid
    // 3. warning has not been sent
    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :lastLogin " +
            "AND u.isActive = true " +
            "AND u.warningEmailSent = false")
    List<User> findUsersInactive(@Param("lastLogin") LocalDateTime lastLogin);


    // inactive after Specific days (lastLogin)
    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :lastLogin " +
            "AND u.isActive = true")
    List<User> findAllInactive(@Param("lastLogin")LocalDateTime lastLogin);
}
