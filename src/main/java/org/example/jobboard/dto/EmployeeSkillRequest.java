package org.example.jobboard.dto;


import lombok.Data;

@Data
public class EmployeeSkillRequest {
    private Long skillId;
    private int proficiencyLevel;
}
