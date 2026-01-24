package org.example.jobboard.repo;

import org.example.jobboard.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepo extends JpaRepository<Employee, Long>{
    Optional<Employee> findByUserId(Long id);
}
