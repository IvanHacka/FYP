package org.example.jobboard.repo;

import org.example.jobboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface UserRepo extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email); // input email find user if exist (Login)
    boolean existsByEmail(String email); //check email existing (Register)
    List<User> findByRoleAndIsActive(User.Role role, Boolean isActive);


    // 1. check last active
    // 2. check if account is valid
    // 3. isActive
    // 4. warning has not been sent
    @Query("SELECT u FROM User u " +
            "WHERE u.lastLoginAt < :thirtyDays " +
            "AND u.lastLoginAt > :fortyDays " +
            "AND u.isActive = true " +
            "AND u.warningEmailSent = false")
    List<User> findUsersInactiveBetween30And40(@Param("thirtyDays") LocalDateTime thirtyDays,
                                               @Param("fortyDays") LocalDateTime fortyDays);


    // For admin tab display
    @Query("SELECT u FROM User u " +
            "WHERE u.lastLoginAt < :fortyDays " +
            "AND u.isActive = true")
    List<User> findInactiveUsersForAdmin(@Param("fortyDays") LocalDateTime fortyDays);

    // inactive after Specific days (lastLogin)
    @Query("SELECT u FROM User u " +
            "WHERE u.lastLoginAt < :fortyDays " +
            "AND u.isActive = true " +
            "AND u.reviewEmailSent = false")
    List<User> findUsersInactiveOver40(@Param("fortyDays")LocalDateTime fortyDays);
}
