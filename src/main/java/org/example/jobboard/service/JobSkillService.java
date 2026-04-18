package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.JobSkillRequest;
import org.example.jobboard.dto.JobSkillResponse;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.JobSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.JobRepo;
import org.example.jobboard.repo.JobSkillRepo;
import org.example.jobboard.repo.SkillRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobSkillService {
    private final JobSkillRepo jobSkillRepo;
    private final JobRepo jobRepo;
    private final SkillRepo skillRepo;

    public JobSkillResponse addJobSkill(JobSkillRequest request, Long jobId, Long employerId) {
        Job job = jobRepo.findById(jobId).orElseThrow(
                () -> new RuntimeException("Job not found"));

        User employer = job.getEmployer();
        if (employer == null || !employer.getId().equals(employerId)) {
            throw new RuntimeException("Employer can only edit their own jobs skills");
        }
        if(jobSkillRepo.existsByJobIdAndSkillId(jobId, request.getSkillId())) {
            throw new RuntimeException("Job skill already exists in this job");
        }
        Skill skill = skillRepo.findById(request.getSkillId()).orElseThrow(
                () -> new RuntimeException("Skill not found"));

        JobSkill jobSkill = JobSkill.builder()
                .job(job)
                .skill(skill)
                .importanceLevel(request.getImportanceLevel())
                .build();
        JobSkill savedJobSkill = jobSkillRepo.save(jobSkill);

        return new JobSkillResponse(
                savedJobSkill.getId(),
                savedJobSkill.getSkill().getId(),
                savedJobSkill.getSkill().getSkillName(),
                savedJobSkill.getImportanceLevel()
        );
    }

    public List<JobSkillResponse> getAllJobSkills(Long jobId) {
        return jobSkillRepo.findByJobId(jobId).stream()
                .map(s -> JobSkillResponse.builder()
                                .id(s.getId())
                                .skillId(s.getSkill().getId())
                                .skillName(s.getSkill().getSkillName())
                        .importanceLevel(s.getImportanceLevel())
                                .build()
                ).toList();
    }
    public JobSkillResponse updateJobSkill(Long skillId, Long employerId, int importanceLevel) {
        JobSkill jobSkill = jobSkillRepo.findById(skillId).orElseThrow(
                ()-> new RuntimeException("Job skill not found")
        );
        if(jobSkill.getJob() == null ||
                jobSkill.getJob().getEmployer().getId() == null ||
                !jobSkill.getJob().getEmployer().getId().equals(employerId)
        ) {
            throw new RuntimeException("Employers can only edit their own jobs skills");
        }

        jobSkill.setImportanceLevel(importanceLevel);
        JobSkill updatedJobSkill = jobSkillRepo.save(jobSkill);
        return new JobSkillResponse(
                updatedJobSkill.getId(),
                updatedJobSkill.getSkill().getId(),
                updatedJobSkill.getSkill().getSkillName(),
                updatedJobSkill.getImportanceLevel()
        );
    }

    public void deleteJobSkill(Long skillId, Long employerId) {
        JobSkill jobSkill = jobSkillRepo.findById(skillId).orElseThrow(
                () -> new RuntimeException("Job skill not found")
        );
        if(jobSkill == null ||
                jobSkill.getJob().getEmployer().getId() == null ||
                !jobSkill.getJob().getEmployer().getId().equals(employerId)
        ) {
            throw new RuntimeException("Employers can only delete their own jobs skills");
        }
        jobSkillRepo.delete(jobSkill);
    }
}
