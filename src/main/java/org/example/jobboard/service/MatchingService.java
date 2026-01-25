package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.EmployeeSkill;
import org.example.jobboard.model.JobSkill;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.JobSkillRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Calculate the compatibility between employee (Job seeker) and jobs (match_score)
// 1. See how important is the skills to the job
// 2. Look at the employee's proficiency level on the skill
// Formula -> weighted percentage of importance and proficiency.
// Expert get most (5) and which beginner get least (1)
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final JobSkillRepo jobSkillRepo;
    private final EmployeeSkillRepo employeeskillRepo;

    public BigDecimal calculateMatchScore(Long jobId, Long employeeId){
        List<JobSkill> jobSkills = jobSkillRepo.findByJobId(jobId);
        List<EmployeeSkill> employeeSkills = employeeskillRepo.findByEmployeeId(employeeId);

        if (jobSkills.isEmpty()){
            return BigDecimal.valueOf(100.00);
        }

        Map<Long, Integer> employeeSkillMap = employeeSkills.stream().collect(
                Collectors.toMap(s -> s.getSkill().getId(), EmployeeSkill::getProficiencyLevel)
        );

        double total = 0; // total point
        double earned = 0;

        // Algorithm for the match score calculation
        // match score depends on the importance of the skill

        for (JobSkill jobSkill : jobSkills) {
            int importance = jobSkill.getImportanceLevel();
            total += (importance * 5.0); // importance of the skill * maximum proficiency level

            Long skillId = jobSkill.getSkill().getId();
            if (employeeSkillMap.containsKey(skillId)){
                int proficiency = employeeSkillMap.get(skillId);
                proficiency = Math.min(proficiency, 5); // Cap 5 just in case (will set a limit in frontend)
                earned += (proficiency * importance);
            }
        }

        if (total == 0){
            return BigDecimal.valueOf(100.00);
        }

        double matchPercentage = (earned / total) * 100;
        return BigDecimal.valueOf(matchPercentage);


    }




}
