package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ApplicationsResponse {
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private Long applicantId;
    private String applicantFullName;
    private String applicantEmail;
    private String applicantCv;
    private String status;
    private LocalDateTime createdAt;
    private BigDecimal matchScore;
}
