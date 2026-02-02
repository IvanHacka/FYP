package org.example.jobboard.repo;

import org.example.jobboard.model.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeSkillRepo extends JpaRepository<EmployeeSkill, Long>{
    List<EmployeeSkill> findByUserId(Long id); // Get skills that are linked to the employee
}
