package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ApplicationsResponse {
//    private Long applicationId;
//    private Long jobId;
//    private String jobTitle;
//    private Long applicantId;
//    private String applicantFullName;
//    private String applicantEmail;
//    private String applicantCv;
//    private String status;
//    private LocalDateTime createdAt;
//    private BigDecimal matchScore;
//    private BigDecimal skillScore;
//    private BigDecimal salaryScore;
//    private BigDecimal locationScore;
//    private BigDecimal titleScore;
//    private BigDecimal jobTypeScore;
private Long applicationId;

// JOb
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
// Application information
    private String status;
    private String employerNotes;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;

// Input field when apply
    private String whyGoodFit;
    private BigDecimal expectedSalary;
    private LocalDate availableStartDate;

    private BigDecimal matchScore;
    private BigDecimal skillScore;
    private BigDecimal salaryScore;
    private BigDecimal locationScore;
    private BigDecimal titleScore;
    private BigDecimal jobTypeScore;

}
