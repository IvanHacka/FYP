package org.example.jobboard.repo;


import org.example.jobboard.model.JobSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//Join Table
public interface JobSkillRepo extends JpaRepository<JobSkill, Long>{
    List<JobSkill> findByJobId(Long id); // Get skills that are linked to the job
}
