package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.example.jobboard.model.Job;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ApplicationsResponse {
// JOb
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
// Personal detail
    private Long applicantId;
    private String applicantFullName;
    private String applicantEmail;
    private String applicantPhone;
    private String applicantLinkedinUrl;
    private String applicantPortfolioUrl;
    private String applicantBio;
    private String applicantCv;

    private List<DocumentResponse> applicantDocuments;
// Preferences
    private String desiredJobTitles;
    private String preferredLocation;
    private Boolean willingToRelocate;
    private BigDecimal preferredSalary;
    private List<Job.JobType> preferredJobTypes;
    private LocalDate availableStartDate;
// Application information
    private String status;
    private String employerNotes;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;



// Input field when apply
    private String whyGoodFit;

    private BigDecimal matchScore;
    private BigDecimal skillScore;
    private BigDecimal salaryScore;
    private BigDecimal locationScore;
    private BigDecimal titleScore;
    private BigDecimal jobTypeScore;



}
