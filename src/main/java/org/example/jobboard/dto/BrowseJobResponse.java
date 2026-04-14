package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.example.jobboard.model.Job;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class BrowseJobResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal minSalary;
    private String location;
    private Job.JobStatus status;
    private LocalDateTime createdAt;
    private BigDecimal matchScore;
    private BigDecimal skillScore;
    private BigDecimal titleScore;
    private BigDecimal locationScore;
    private BigDecimal salaryScore;
    private BigDecimal jobTypeScore;
}
