package org.example.jobboard.dto;


import lombok.Data;

import java.util.List;

@Data
public class EmployeeProfileRequest {
    private Long userId;
    private String fullName;
    private String cv;
    private String bio;
    private List<EmployeeSkillRequest> skills;
}
