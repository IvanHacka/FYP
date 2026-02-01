package org.example.jobboard.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class JobRequest {
    private String title;
    private String description;
    private BigDecimal minSalary;
    private String location;
    private Long employerId;
    private List<SkillRequest> skills;

}
