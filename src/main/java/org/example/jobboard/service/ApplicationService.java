package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.*;
import org.example.jobboard.model.*;
import org.example.jobboard.repo.*;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepo applicationRepo;
    private final JobRepo jobRepo;
    private final UserRepo userRepo;
    private final MatchingService matchingService;
    private final DocumentRepo documentRepo;
    private final ApplicationStatusHistoryRepo applicationStatusHistoryRepo;
    private final PreferenceRepo preferenceRepo;

    public Application jobApply(Long jobId, Long userId, String whyGoodFit) {

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

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .matchScore(score)
                .whyGoodFit(whyGoodFit)
                .status(Application.ApplicationStatus.SUBMITTED)
                .build();

        return applicationRepo.save(application);
    }

    public List<EmployeeApplicationResponse> getMyApplications(Long applicantId) {
        return applicationRepo.findByApplicantIdOrderByCreatedAtDesc(applicantId)
                .stream().map(app ->{
                    MatchScoreBreakdownRequest breakdowns = matchingService.calculateBreakdowns(
                        app.getJob().getId(),
                        app.getApplicant().getId()
                    );

                    return EmployeeApplicationResponse.builder()
                    .applicationId(app.getId())
                    .jobId(app.getJob() != null ? app.getJob().getId() : null)
                    .jobTitle(app.getJob() != null ? app.getJob().getTitle() : null)

                    .status(app.getStatus() != null ? app.getStatus().name() : null)
                    .employerNotes(app.getEmployerNotes())
                    .reviewedAt(app.getReviewedAt())
                    .createdAt(app.getCreatedAt())
                    .shortlistedAt(app.getShortlistedAt())
                    .rejectedAt(app.getRejectedAt())
                    .acceptedAt(app.getAcceptedAt())
                    .withdrawnAt(app.getWithdrawnAt())
                    .matchScore(breakdowns.getFinalScore())
                    .skillScore(breakdowns.getSkillScore())
                    .salaryScore(breakdowns.getSalaryScore())
                    .locationScore(breakdowns.getLocationScore())
                    .titleScore(breakdowns.getTitleScore())
                    .jobTypeScore(breakdowns.getJobTypeScore())

                    .whyGoodFit(app.getWhyGoodFit())
                    .expectedSalary(app.getExpectedSalary())
                    .availableStartDate(app.getAvailableStartDate())

                    .companyName(
                            app.getJob() != null && app.getJob().getEmployer() != null ?
                                    app.getJob().getEmployer().getCompanyName() :
                                    null
                    )
                    .companyWebsite(
                            app.getJob() != null && app.getJob().getEmployer() != null ?
                                    app.getJob().getEmployer().getCompanyWebsite() :
                                    null
                    )
                    .jobLocation(app.getJob() != null ? app.getJob().getLocation() : null)
                    .jobMinSalary(app.getJob() != null ? app.getJob().getMinSalary() : null)
                    .companyDescription(app.getJob() != null ? app.getJob().getDescription() : null)
                    .build();
                })
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
//                            .applicantDocuments(
//                                    app.getApplicant() != null && app.getApplicant().getDocuments() != null
//                                            ? app.getApplicant().getDocuments().stream()
//                                            .map(doc -> DocumentResponse.builder()
//                                                    .documentId(doc.getId())
//                                                    .documentName(doc.getDocumentName())
//                                                    .documentType(doc.getDocumentType().name())
//                                                    .build())
//                                            .toList()
//                                            : List.of()
//                            )
                            .applicantDocuments(
                                    app.getApplicant() != null ?
                                            mapApplicantDocuments(app.getApplicant().getId()) :
                                            List.of()
                            )
                            .status(app.getStatus() != null ? app.getStatus().name() : null)
                            .employerNotes(app.getEmployerNotes())
                            .reviewedAt(app.getReviewedAt())
                            .createdAt(app.getCreatedAt())
                            .whyGoodFit(app.getWhyGoodFit())
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
                    Preference preference = app.getApplicant() != null
                            ? preferenceRepo.findByUserId(app.getApplicant().getId()).orElse(null) :
                            null;

                    return ApplicationsResponse.builder()
                            .applicationId(app.getId())
                            .jobId(app.getJob() != null ? app.getJob().getId() : null)
                            .jobTitle(app.getJob() != null ? app.getJob().getTitle() : null)
                            // Details
                            .applicantId(app.getApplicant() != null ? app.getApplicant().getId() : null)
                            .applicantFullName(app.getApplicant() != null ? app.getApplicant().getFullName() : null)
                            .applicantEmail(app.getApplicant() != null ? app.getApplicant().getEmail() : null)
                            .applicantPhone(app.getApplicant() != null ? app.getApplicant().getPhone() : null)
                            .applicantLinkedinUrl(app.getApplicant() != null ? app.getApplicant().getLinkedinUrl() : null)
                            .applicantPortfolioUrl(app.getApplicant() != null ? app.getApplicant().getPortfolioUrl() : null)
                            .applicantBio(app.getApplicant() != null ? app.getApplicant().getBio() : null)
                            .applicantDocuments(
                                    app.getApplicant() != null && app.getApplicant().getDocuments() != null ?
                                            app.getApplicant().getDocuments().stream()
                                            .map(doc -> DocumentResponse.builder()
                                                    .documentId(doc.getId())
                                                    .documentName(doc.getDocumentName())
                                                    .documentType(doc.getDocumentType().name())
                                                    .build())
                                            .toList()
                                            :
                                            List.of()
                            )
                            .status(app.getStatus() != null ? app.getStatus().name() : null)
                            .employerNotes(app.getEmployerNotes())
                            .reviewedAt(app.getReviewedAt())
                            .createdAt(app.getCreatedAt())
                            .whyGoodFit(app.getWhyGoodFit())
                            .desiredJobTitles(preference != null ? preference.getDesiredJobTitles() : null)
                            .preferredLocation(preference != null ? preference.getPreferredLocations() : null)
                            .willingToRelocate(preference != null ? preference.getWillingToRelocate() : null)
                            .preferredSalary(preference != null ? preference.getMinExpectedSalary() : null)
                            .preferredJobTypes(preference != null ? preference.getJobTypes() : List.of())
                            .availableStartDate(preference != null ? preference.getAvailableStartDate() : null)
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
                                                                   String employerNotes)
    {
        Application application = applicationRepo.findByIdAndJobEmployerId(applicationId, employerId)
                .orElseThrow(() -> new RuntimeException("Application not found or access denied"));

        Application.ApplicationStatus oldStatus = application.getStatus();

        application.setStatus(status);
        if (status == Application.ApplicationStatus.REJECTED) {
            application.setRejectedAt(LocalDateTime.now());
            application.setShortlistedAt(null);
            application.setAcceptedAt(null);
        }

        if (status == Application.ApplicationStatus.SHORTLISTED) {
            application.setShortlistedAt(LocalDateTime.now());
            application.setRejectedAt(null);
        }

        if (status == Application.ApplicationStatus.ACCEPTED) {
            application.setAcceptedAt(LocalDateTime.now());
            application.setRejectedAt(null);
        }
        if (status == Application.ApplicationStatus.UNDER_REVIEW) {
            application.setReviewedAt(LocalDateTime.now());
            application.setShortlistedAt(null);
            application.setAcceptedAt(null);
            application.setRejectedAt(null);
        }
        application.setEmployerNotes(employerNotes);

        switch (status) {
            case UNDER_REVIEW -> application.setReviewedAt(LocalDateTime.now());
            case SHORTLISTED -> application.setShortlistedAt(LocalDateTime.now());
            case REJECTED -> application.setRejectedAt(LocalDateTime.now());
            case ACCEPTED -> application.setAcceptedAt(LocalDateTime.now());
            case WITHDRAWN -> application.setWithdrawnAt(LocalDateTime.now());
        }

        Application saved = applicationRepo.save(application);

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(saved)
                .oldStatus(oldStatus)
                .newStatus(saved.getStatus())
                .employerNotes(employerNotes)
                .build();

        applicationStatusHistoryRepo.save(history);

        return UpdateApplicationStatusResponse.builder()
                .applicationId(saved.getId())
                .status(saved.getStatus().name())
                .employerNotes(saved.getEmployerNotes())
                .reviewedAt(saved.getReviewedAt())
                .shortlistedAt(saved.getShortlistedAt())
                .rejectedAt(saved.getRejectedAt())
                .acceptedAt(saved.getAcceptedAt())
                .withdrawnAt(saved.getWithdrawnAt())
                .build();
    }

    public List<ApplicationStatusHistoryResponse> getApplicationTimeline(Long applicationId, Long userId, User.Role role) {
        Application application;

        if (role == User.Role.EMPLOYER) {
            application = applicationRepo.findByIdAndJobEmployerId(applicationId, userId)
                    .orElseThrow(() -> new RuntimeException("Application not found or access denied"));
        } else if (role == User.Role.EMPLOYEE) {
            application = applicationRepo.findByIdAndApplicantId(applicationId, userId)
                    .orElseThrow(() -> new RuntimeException("Application not found or access denied"));
        } else {
            throw new RuntimeException("Access denied");
        }

        return applicationStatusHistoryRepo.findByApplicationIdOrderByChangedAtAsc(application.getId())
                .stream()
                .map(h -> ApplicationStatusHistoryResponse.builder()
                        .id(h.getId())
                        .oldStatus(h.getOldStatus() != null ? h.getOldStatus().name() : null)
                        .newStatus(h.getNewStatus() != null ? h.getNewStatus().name() : null)
                        .employerNotes(h.getEmployerNotes())
                        .changedAt(h.getChangedAt())
                        .build())
                .toList();
    }

    public Application withdrawApplication(Long applicationId, Long applicantId) {
        Application application = applicationRepo.findByIdAndApplicantId(applicationId, applicantId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() == Application.ApplicationStatus.ACCEPTED ||
                application.getStatus() == Application.ApplicationStatus.REJECTED) {
            throw new RuntimeException("This application can no longer be withdrawn");
        }

        Application.ApplicationStatus oldStatus = application.getStatus();

        application.setStatus(Application.ApplicationStatus.WITHDRAWN);
        application.setWithdrawnAt(LocalDateTime.now());
        Application saved = applicationRepo.save(application);
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(saved)
                .oldStatus(oldStatus)
                .newStatus(Application.ApplicationStatus.WITHDRAWN)
                .employerNotes(null)
                .build();

        applicationStatusHistoryRepo.save(history);
        return saved;

    }

    private List<DocumentResponse> mapApplicantDocuments(Long applicantId) {
        return documentRepo.findByUserId(applicantId).stream()
                .map(doc -> DocumentResponse.builder()
                        .documentId(doc.getId())
                        .documentName(doc.getDocumentName())
                        .documentType(doc.getDocumentType().name())
                        .build())
                .toList();
    }

    public Document getApplicantDocumentForEmployer(Long applicationId, Long documentId, Long employerId) {
        Application application = applicationRepo.findByIdAndJobEmployerId(applicationId, employerId)
                .orElseThrow(() -> new RuntimeException("Application not found or access denied"));

        Long applicantId = application.getApplicant().getId();

        return documentRepo.findByIdAndUserId(documentId, applicantId).orElseThrow(
                () -> new RuntimeException("Document not found or access denied"));
    }


}
