package org.example.jobboard.repo;

import org.example.jobboard.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepo extends JpaRepository<Skill, Long>{
    Optional<Skill> findBySkillName(String skill); // Check skill name and prevent duplicate

}
