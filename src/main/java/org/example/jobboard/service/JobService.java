package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.JobRequest;
import org.example.jobboard.dto.SkillRequest;
import org.example.jobboard.model.*;
import org.example.jobboard.repo.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

// Job creation
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepo jobRepo;
    private final JobSkillRepo jobSkillRepo;
    private final UserRepo userRepo;
    private final SkillRepo skillRepo;

    // Job and skills should be saved together
    @Transactional
    public Job postJob (JobRequest jobRequest) {
        // Fetch employer
        User employer = userRepo.findById(jobRequest.getEmployerId()).orElseThrow(() -> new RuntimeException("Employer not found"));


        // Create a Job
        Job job = new Job();
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setLocation(jobRequest.getLocation());
        job.setMinSalary(jobRequest.getMinSalary());
        job.setEmployer(employer);
        job.setStatus(Job.JobStatus.OPEN);
        Job savedJob = jobRepo.save(job);

        // Bind skills with job
        if(jobRequest.getSkills() != null) {
            for(SkillRequest skillRequest : jobRequest.getSkills()) {
                // Find exsisting skills
                Skill skill = skillRepo.findById(skillRequest.getSkillId()).orElseThrow(
                        () -> new RuntimeException("Skill not found"));
                // Link job and skill (jobSkill table)
                JobSkill jobSkill = new JobSkill();
                jobSkill.setJob(savedJob);
                jobSkill.setSkill(skill);
                jobSkillRepo.save(jobSkill);
            }
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
