package org.example.jobboard.repo;

import org.example.jobboard.model.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeSkillRepo extends JpaRepository<EmployeeSkill, Long>{
    List<EmployeeSkill> findByUserId(Long id); // Get skills that are linked to the employee

    Optional<EmployeeSkill> findByUserIdAndSkillId(Long id, Long skillId); // find specific skill for the user

    boolean existsByUserIdAndSkillId(Long id, Long skillId); // check

    void deleteByUserIdAndSkillId(Long id, Long skillId);

    Long countByUserId(Long id); // Count how many
}
