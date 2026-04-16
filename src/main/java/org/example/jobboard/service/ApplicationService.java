package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.*;
import org.example.jobboard.model.Application;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.ApplicationRepo;
import org.example.jobboard.repo.JobRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepo applicationRepo;
    private final JobRepo jobRepo;
    private final UserRepo userRepo;
    private final MatchingService matchingService;

    public Application jobApply(Long jobId, Long userId, String whyGoodFit,
                                BigDecimal expectedSalary, LocalDate availableStartDate) {

        if (applicationRepo.existsByApplicantIdAndJobId(userId, jobId)) {
            throw new RuntimeException("You have already applied for the job with id " + jobId);
        }

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job with id " + jobId + " not found"));

        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new RuntimeException("This job is not open for applications");
        }

        User applicant = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        if (applicant.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("Only candidate can apply");
        }

        BigDecimal score = matchingService.calculateMatchScore(jobId, userId);

        if (expectedSalary != null && expectedSalary.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Expected salary must be greater than 0");
        }

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .matchScore(score)
                .coverLetterDocument(applicant.getCurrentCoverLetter())
                .whyGoodFit(whyGoodFit)
                .expectedSalary(expectedSalary)
                .availableStartDate(availableStartDate)
                .status(Application.ApplicationStatus.SUBMITTED)
                .build();

        return applicationRepo.save(application);
    }

    public List<EmployeeApplicationResponse> getMyApplications(Long applicantId) {
        return applicationRepo.findByApplicantIdOrderByCreatedAtDesc(applicantId)
                .stream().map(app -> EmployeeApplicationResponse.builder()
                        .applicationId(app.getId())
                        .jobId(app.getJob().getId())
                        .jobTitle(app.getJob().getTitle())
                        .status(app.getStatus().name())
                        .employerNotes(app.getEmployerNotes())
                        .reviewedAt(app.getReviewedAt())
                        .createdAt(app.getCreatedAt())
                        .matchScore(app.getMatchScore())
                        .build())
                .toList();
    }

    public List<ApplicationsResponse> getApplicationByCompany(Long employerId) {
        List<Application> applications = applicationRepo.findByJobEmployerId(employerId);

        return applications.stream()
                .map(app -> {
                    MatchScoreBreakdownRequest breakdowns = matchingService.calculateBreakdowns(
                            app.getJob().getId(),
                            app.getApplicant().getId()

                    );

                    return ApplicationsResponse.builder()
                            .applicationId(app.getId())
                            .jobId(app.getJob() != null ? app.getJob().getId() : null)
                            .jobTitle(app.getJob() != null ? app.getJob().getTitle() : null)
                            .applicantId(app.getApplicant() != null ? app.getApplicant().getId() : null)
                            .applicantFullName(app.getApplicant() != null ? app.getApplicant().getFullName() : null)
                            .applicantEmail(app.getApplicant() != null ? app.getApplicant().getEmail() : null)
                            .applicantCv(app.getApplicant() != null ? app.getApplicant().getCv() : null)
                            .status(app.getStatus() != null ? app.getStatus().name() : null)
                            .employerNotes(app.getEmployerNotes())
                            .reviewedAt(app.getReviewedAt())
                            .createdAt(app.getCreatedAt())
                            .whyGoodFit(app.getWhyGoodFit())
                            .expectedSalary(app.getExpectedSalary())
                            .availableStartDate(app.getAvailableStartDate())
                            .matchScore(breakdowns.getFinalScore())
                            .skillScore(breakdowns.getSkillScore())
                            .salaryScore(breakdowns.getSalaryScore())
                            .locationScore(breakdowns.getLocationScore())
                            .titleScore(breakdowns.getTitleScore())
                            .jobTypeScore(breakdowns.getJobTypeScore())
                            .build();
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

                    return ApplicationsResponse.builder()
                            .applicationId(app.getId())
                            .jobId(app.getJob() != null ? app.getJob().getId() : null)
                            .jobTitle(app.getJob() != null ? app.getJob().getTitle() : null)
                            .applicantId(app.getApplicant() != null ? app.getApplicant().getId() : null)
                            .applicantFullName(app.getApplicant() != null ? app.getApplicant().getFullName() : null)
                            .applicantEmail(app.getApplicant() != null ? app.getApplicant().getEmail() : null)
                            .applicantPhone(app.getApplicant() != null ? app.getApplicant().getPhone() : null)
                            .applicantLinkedinUrl(app.getApplicant() != null ? app.getApplicant().getLinkedinUrl() : null)
                            .applicantPortfolioUrl(app.getApplicant() != null ? app.getApplicant().getPortfolioUrl() : null)
                            .applicantBio(app.getApplicant() != null ? app.getApplicant().getBio() : null)
                            .applicantCv(app.getApplicant() != null ? app.getApplicant().getCv() : null)
                            .status(app.getStatus() != null ? app.getStatus().name() : null)
                            .employerNotes(app.getEmployerNotes())
                            .reviewedAt(app.getReviewedAt())
                            .createdAt(app.getCreatedAt())
                            .whyGoodFit(app.getWhyGoodFit())
                            .expectedSalary(app.getExpectedSalary())
                            .availableStartDate(app.getAvailableStartDate())
                            .matchScore(breakdowns.getFinalScore())
                            .skillScore(breakdowns.getSkillScore())
                            .salaryScore(breakdowns.getSalaryScore())
                            .locationScore(breakdowns.getLocationScore())
                            .titleScore(breakdowns.getTitleScore())
                            .jobTypeScore(breakdowns.getJobTypeScore())
                            .build();
                })
                .toList();
    }


    public UpdateApplicationStatusResponse updateApplicationStatus(Long applicationId, Long employerId,
                                                                   Application.ApplicationStatus status,
                                                                   String employerNotes) {
        Application application = applicationRepo.findByIdAndJobEmployerId(applicationId, employerId)
                .orElseThrow(() -> new RuntimeException("Application not found or access denied"));

        application.setStatus(status);
        application.setEmployerNotes(employerNotes);
        application.setReviewedAt(java.time.LocalDateTime.now());

        Application savedApplication = applicationRepo.save(application);

        return UpdateApplicationStatusResponse.builder()
                .applicationId(savedApplication.getId())
                .status(savedApplication.getStatus().name())
                .employerNotes(savedApplication.getEmployerNotes())
                .reviewedAt(savedApplication.getReviewedAt())
                .build();
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
