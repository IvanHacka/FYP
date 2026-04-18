package org.example.jobboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class JobSkillResponse {

        private Long id;
        private Long skillId;
        private String skillName;
        private int importanceLevel;
}
