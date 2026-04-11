package org.example.jobboard.dto;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class EmployeeSkillRequest {
    private Long skillId;
    @Min(1)
    @Max(5)
    private int proficiencyLevel;
}
