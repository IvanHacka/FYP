package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.ApplicationsResponse;
import org.example.jobboard.dto.MatchScoreBreakdownRequest;
import org.example.jobboard.model.Application;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.ApplicationRepo;
import org.example.jobboard.repo.JobRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepo applicationRepo;
    private final JobRepo jobRepo;
    private final UserRepo userRepo;
    private final MatchingService matchingService;

    public Application jobApply(Long jobId, Long userId, String whyGoodFit) {

        if (applicationRepo.existsByApplicantIdAndJobId(userId, jobId)) {
            throw new RuntimeException(
                    "You have already applied for the job with id " + jobId);
        }
        // Find job
        Job job = jobRepo.findById(jobId).orElseThrow(() ->
                new RuntimeException("Job with id " + jobId + " not found"));
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new RuntimeException("This job is not open for applications");
        }

        // Find applicant
        User applicant = userRepo.findById(userId).orElseThrow(() ->
                new RuntimeException("Applicant not found"));
        if (applicant.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("Only candidate can apply");
        }

        BigDecimal score = matchingService.calculateMatchScore(jobId, userId);
        Application application = Application.builder()
                .job(job).applicant(applicant).matchScore(score)
                .coverLetterDocument(applicant.getCurrentCoverLetter()).whyGoodFit(whyGoodFit)
                .status(Application.ApplicationStatus.SUBMITTED)
                .build();
        return applicationRepo.save(application);
    }

    public List<Application> getMyApplications(Long applicantId) {
        return applicationRepo.findByApplicantIdOrderByCreatedAtDesc(applicantId);
    }

    public List<ApplicationsResponse> getApplicationByCompany(Long employerId) {
        List<Application> applications = applicationRepo.findByJobEmployerId(employerId);

        return applications.stream()
                .map(app -> {
                    MatchScoreBreakdownRequest breakdowns = matchingService.calculateBreakdowns(
                            app.getJob().getId(),
                            app.getApplicant().getId()

                    );

                    return new ApplicationsResponse(
                            app.getId(),
                            app.getJob() != null?app.getJob().getId() : null,
                            app.getJob() != null? app.getJob().getTitle() : null,
                            app.getApplicant() != null? app.getApplicant().getId() : null,
                            app.getApplicant() != null? app.getApplicant().getFullName() : null,
                            app.getApplicant() != null? app.getApplicant().getEmail() : null,
                            app.getApplicant() != null? app.getApplicant().getCv() : null,
                            app.getStatus() != null? app.getStatus().name() : null,
                            app.getCreatedAt(),
                            app.getMatchScore(),
                            breakdowns.getSkillScore(),
                            breakdowns.getTitleScore(),
                            breakdowns.getLocationScore(),
                            breakdowns.getSalaryScore(),
                            breakdowns.getJobTypeScore()
                            );
                })
                .toList();
    }


    public List<ApplicationsResponse> getApplicantsForJob(Long jobId) {
        List<Application> applications = applicationRepo.findByJobIdOrderByCreatedAtDesc(jobId);

        return applications.stream()
                .map(app -> {
                    MatchScoreBreakdownRequest breakdowns = matchingService.calculateBreakdowns(
                            app.getJob().getId(),
                            app.getApplicant().getId()
                    );

                    return new ApplicationsResponse(
                            app.getId(),
                            app.getJob() != null ? app.getJob().getId() : null,
                            app.getJob() != null ? app.getJob().getTitle() : null,
                            app.getApplicant() != null ? app.getApplicant().getId() : null,
                            app.getApplicant() != null ? app.getApplicant().getFullName() : null,
                            app.getApplicant() != null ? app.getApplicant().getEmail() : null,
                            app.getApplicant() != null ? app.getApplicant().getCv() : null,
                            app.getStatus() != null ? app.getStatus().name() : null,
                            app.getCreatedAt(),
                            app.getMatchScore(),
                            breakdowns.getSkillScore(),
                            breakdowns.getTitleScore(),
                            breakdowns.getLocationScore(),
                            breakdowns.getSalaryScore(),
                            breakdowns.getJobTypeScore()
                    );
                })
                .toList();
    }


    public Application updateApplicationStatus(Long applicationId, Long employerId,
                                               Application.ApplicationStatus status,
                                               String employerNotes) {
        Application application = applicationRepo.findByIdAndJobEmployerId(applicationId, employerId)
                .orElseThrow(() -> new RuntimeException("Application not found or access denied"));

        application.setStatus(status);
        application.setEmployerNotes(employerNotes);
        application.setReviewedAt(java.time.LocalDateTime.now());

        return applicationRepo.save(application);
    }

    public Application withdrawApplication(Long applicationId, Long applicantId) {
        Application application = applicationRepo.findByIdAndApplicantId(applicationId, applicantId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() == Application.ApplicationStatus.ACCEPTED ||
                application.getStatus() == Application.ApplicationStatus.REJECTED) {
            throw new RuntimeException("This application can no longer be withdrawn");
        }

        application.setStatus(Application.ApplicationStatus.WITHDRAWN);
        return applicationRepo.save(application);
    }

}
