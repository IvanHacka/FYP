package org.example.jobboard.repo;

import org.example.jobboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepo extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email); // input email find user if exist (Login)
    boolean existsByEmail(String email); //check email existing (Register)
}
