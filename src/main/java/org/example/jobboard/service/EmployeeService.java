package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.EmployeeSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.SkillRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepo userRepo;
    private final SkillRepo skillRepo;
    private final EmployeeSkillRepo employeeSkillRepo;

    public List<EmployeeSkill> getUserSkills(Long userId){
        return employeeSkillRepo.findByUserId(userId);
    }
    public EmployeeSkill addSkill(Long userId, Long skillId, int proficiency) {
        Optional<EmployeeSkill> existSkill = employeeSkillRepo.findByUserIdAndSkillId(userId, skillId);
        if(existSkill.isPresent()) {
            throw new RuntimeException("Skill already exists");
        }
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Skill skill = skillRepo.findById(skillId).orElseThrow(() -> new RuntimeException("Skill not found"));

        EmployeeSkill employeeSkill = EmployeeSkill.builder().user(user).skill(skill)
                .proficiencyLevel(proficiency)
                .build();

        return employeeSkillRepo.save(employeeSkill);
    }

    public void deleteSkill(Long userId, Long skillId) {
        EmployeeSkill employeeSkill = employeeSkillRepo.findByUserIdAndSkillId(userId, skillId).orElseThrow(() ->
                new RuntimeException("Skill not found"));

        employeeSkillRepo.delete(employeeSkill);
    }

    public EmployeeSkill updateSkillProficiency(Long userId, Long skillId, int proficiency) {
        EmployeeSkill employeeSkill = employeeSkillRepo.findByUserIdAndSkillId(userId, skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with this user id: " + userId));
        employeeSkill.setProficiencyLevel(proficiency);
        return employeeSkillRepo.save(employeeSkill);
    }


    // Count skills user has
    public Long countSkill(Long userId){
        return employeeSkillRepo.countByUserId(userId);
    }


}
