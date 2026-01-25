package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.Employer;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.JobSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.repo.EmployerRepo;
import org.example.jobboard.repo.JobRepo;
import org.example.jobboard.repo.JobSkillRepo;
import org.example.jobboard.repo.SkillRepo;
import org.springframework.stereotype.Service;

import java.util.List;

// Job creation
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepo jobRepo;
    private final JobSkillRepo jobSkillRepo;
    private final EmployerRepo employerRepo;
    private final SkillRepo skillRepo;

    // Job and skills should be save together
    @Transactional
    public Job postJob (Long employerId, Job jobData, List<JobSkill> skills){
        Employer employer = employerRepo.findById(employerId).orElseThrow(() -> new RuntimeException("Employer not found"));

        jobData.setEmployer(employer);
        jobData.setStatus(Job.JobStatus.OPEN);
        Job savedJob = jobRepo.save(jobData);

        // Bind skills with job
        for (JobSkill skill : skills) {
            Long skillId = skill.getSkill().getId();
            Skill skillList = skillRepo.findById(skillId).orElseThrow(() -> new RuntimeException("Skill not found"));

            skill.setJob(savedJob);
            skill.setSkill(skillList);
            jobSkillRepo.save(skill);
        }
        return savedJob;

    }
    public List<Job> getAllOPENJobs(){
        return jobRepo.findByStatus(Job.JobStatus.OPEN);
    }

    // search jobs
    public List<Job> searchJobs(String title, String location, BigDecimal salary){
        return jobRepo.search(title, location, salary);
    }

}
