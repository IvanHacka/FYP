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
public class EmployeeApplicationResponse {
    private Long applicationId;
    private Long jobId;
    private String jobTitle;

    private String status;
    private String employerNotes;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime shortlistedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime withdrawnAt;

    private BigDecimal matchScore;
    private BigDecimal skillScore;
    private BigDecimal salaryScore;
    private BigDecimal locationScore;
    private BigDecimal titleScore;
    private BigDecimal jobTypeScore;

    private String whyGoodFit;
    private BigDecimal expectedSalary;
    private LocalDate availableStartDate;

    private String companyName;
    private String companyWebsite;
    private String jobLocation;
    private BigDecimal jobMinSalary;
    private String jobDescription;


}
