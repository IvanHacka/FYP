package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileCompletionResponse {
    private int completionScore;
    private boolean hasBasicInfo;
    private boolean hasSkills;
    private boolean hasCv;
    private boolean hasExperience;
    private boolean hasEducation;
}
