package org.example.jobboard.repo;


import org.example.jobboard.model.JobSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

//Join Table
public interface JobSkillRepo extends JpaRepository<JobSkill, Long>{
    List<JobSkill> findByJobId(Long jobId); // Get skills that are linked to the job
    Optional<JobSkill> findByJobIdAndSkillId(Long jobId, Long skillId);
    boolean existsByJobIdAndSkillId(Long jobId, Long skillId);


}
