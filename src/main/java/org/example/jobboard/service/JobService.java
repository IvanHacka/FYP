package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.*;
import org.example.jobboard.model.*;
import org.example.jobboard.repo.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Job creation
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepo jobRepo;
    private final JobSkillRepo jobSkillRepo;
    private final UserRepo userRepo;
    private final SkillRepo skillRepo;
    private final MatchingService matchingService;

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
    public List<Job> getJobsByEmployer(Long userId){
        return jobRepo.findByEmployerId(userId);
    }
    public List<BrowseJobResponse> getAllOPENJobs(Long employeeId){
        List<Job> jobs = jobRepo.findByStatus(Job.JobStatus.OPEN);
        return jobs.stream().map(job -> {
            MatchScoreBreakdownRequest breakdowns = matchingService.calculateBreakdowns(job.getId(), employeeId);
            return BrowseJobResponse.builder()
                    .id(job.getId())
                    .title(job.getTitle())
                    .description(job.getDescription())
                    .minSalary(job.getMinSalary())
                    .location(job.getLocation())
                    .status(job.getStatus())
                    .createdAt(job.getCreatedAt())
                    .expiresAt(job.getExpiresAt())
                    .companyName(job.getEmployer() != null ? job.getEmployer().getCompanyName() : null)
                    .companyWebsite(job.getEmployer() != null ? job.getEmployer().getCompanyWebsite() : null)
                    .jobSkills(mapJobSkills(job.getId()))

                    .matchScore(breakdowns.getFinalScore())
                    .skillScore(breakdowns.getSkillScore())
                    .titleScore(breakdowns.getTitleScore())
                    .locationScore(breakdowns.getLocationScore())
                    .salaryScore(breakdowns.getSalaryScore())
                    .jobTypeScore(breakdowns.getJobTypeScore())
                    .build();
        }).toList();
    }

    // search jobs
    public List<BrowseJobResponse> searchJobs(Long employeeId, String title, String location, BigDecimal minSalary){
        String titleParam = (title != null && !title.trim().isEmpty()) ? title.trim() : null;
        String locationParam = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        BigDecimal salaryParam = (minSalary != null && minSalary.compareTo(BigDecimal.ZERO) > 0) ? minSalary : null;
        List<Job> jobs = jobRepo.search(Job.JobStatus.OPEN, titleParam, locationParam, salaryParam);

        return jobs.stream().map(job -> {
            MatchScoreBreakdownRequest breakdowns = matchingService.calculateBreakdowns(job.getId(), employeeId);
            return BrowseJobResponse.builder()
                    .id(job.getId())
                    .title(job.getTitle())
                    .description(job.getDescription())
                    .minSalary(job.getMinSalary())
                    .location(job.getLocation())
                    .status(job.getStatus())
                    .createdAt(job.getCreatedAt())
                    .expiresAt(job.getExpiresAt())
                    .companyName(job.getEmployer() != null ? job.getEmployer().getCompanyName() : null)
                    .companyWebsite(job.getEmployer() != null ? job.getEmployer().getCompanyWebsite() : null)
                    .jobSkills(mapJobSkills(job.getId()))

                    .matchScore(breakdowns.getFinalScore())
                    .skillScore(breakdowns.getSkillScore())
                    .titleScore(breakdowns.getTitleScore())
                    .locationScore(breakdowns.getLocationScore())
                    .salaryScore(breakdowns.getSalaryScore())
                    .jobTypeScore(breakdowns.getJobTypeScore())
                    .build();
        }).toList();
    }

//    public Job getJobById(Long id){
//        return jobRepo.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
//    }

    public void deleteJob(Long jobId, Long employerId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Unauthorized");
        }

        jobRepo.delete(job);
    }

    public Job updateJobStatus(Long jobId, Long employerId, Job.JobStatus newStatus) {
        Job job = jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        if(!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Who Are You?");
        }
        job.setStatus(newStatus);
        return jobRepo.save(job);
    }

    public Job updateExpiry(Long jobId, Long employerId, LocalDateTime expiresAt) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Access denied");
        }

        job.setExpiresAt(expiresAt);

        if (expiresAt != null && expiresAt.isBefore(LocalDateTime.now())) {
            job.setStatus(Job.JobStatus.EXPIRED);
        } else if (job.getStatus() == Job.JobStatus.EXPIRED) {
            job.setStatus(Job.JobStatus.OPEN);
        }

        return jobRepo.save(job);
    }


    public List<JobSkillResponse> mapJobSkills(Long jobId){
        return jobSkillRepo.findByJobId(jobId).stream()
                .map(s -> JobSkillResponse.builder()
                        .id(s.getId())
                        .skillId(s.getSkill().getId())
                        .skillName(s.getSkill().getSkillName())
                        .importanceLevel(s.getImportanceLevel())
                        .build()
                ).toList();
    }
}
