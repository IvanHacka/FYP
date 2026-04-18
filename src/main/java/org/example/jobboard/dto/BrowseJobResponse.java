package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobboard.model.Job;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BrowseJobResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal minSalary;
    private String location;
    private Job.JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String companyName;
    private String companyWebsite;

    List<JobSkillResponse> jobSkills;

    private BigDecimal matchScore;
    private BigDecimal skillScore;
    private BigDecimal titleScore;
    private BigDecimal locationScore;
    private BigDecimal salaryScore;
    private BigDecimal jobTypeScore;
}
