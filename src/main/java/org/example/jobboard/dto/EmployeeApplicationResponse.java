package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
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
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private BigDecimal matchScore;
}
