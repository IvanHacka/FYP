package org.example.jobboard.dto;


import lombok.Data;

@Data
public class SkillRequest {
    private Long skillId;
    private int importanceLevel;
}
