package org.example.jobboard.dto;

import lombok.Data;

@Data
public class SkillProficiencyRequest {
    private Long skillId;
    private int proficiencyLevel;
}
