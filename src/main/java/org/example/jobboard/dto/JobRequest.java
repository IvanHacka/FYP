package org.example.jobboard.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class JobRequest {
    private Long employerId;
    private String title;
    private String description;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String location;
    private List<SkillRequest> skills;
}
