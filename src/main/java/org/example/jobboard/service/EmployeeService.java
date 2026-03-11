package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployeeProfileRequest;
import org.example.jobboard.dto.EmployeeSkillRequest;
import org.example.jobboard.model.EmployeeSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.SkillRepo;
import org.example.jobboard.repo.UserRepo;
import org.example.jobboard.util.FileStorageUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepo userRepo;
    private final SkillRepo skillRepo;
    private final EmployeeSkillRepo employeeSkillRepo;


//    // Profile and skills save together
//    @Transactional
//    public User createProfile(EmployeeProfileRequest employeeProfileRequest, String email) {
//        User user = userRepo.findById(employeeProfileRequest.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if(employeeProfileRequest.getFullName() != null) {
//            user.setFullName(employeeProfileRequest.getFullName());
//        }
//        if(employeeProfileRequest.getBio() != null) {
//            user.setBio(employeeProfileRequest.getBio());
//        }
//        User savedUser = userRepo.save(user);
//
//        // handle skills
//        if(employeeProfileRequest.getSkills() != null) {
//            for(EmployeeSkillRequest req: employeeProfileRequest.getSkills()){
//                Skill skill = skillRepo.findById(req.getSkillId()).orElseThrow(
//                        () -> new RuntimeException("Skill not found"));
//
//                Optional<EmployeeSkill> existedSkill = employeeSkillRepo
//                        .findByUserIdAndSkillId(savedUser.getId(), req.getSkillId());
//
//                // update if exist
//                if(existedSkill.isPresent()){
//                    EmployeeSkill employeeSkill = existedSkill.get();
//                    employeeSkill.setProficiencyLevel(req.getProficiencyLevel());
//                    employeeSkillRepo.save(employeeSkill);
//                }
//                else{
//                    EmployeeSkill employeeSkill = EmployeeSkill.builder()
//                            .user(savedUser)
//                            .skill(skill)
//                            .proficiencyLevel(req.getProficiencyLevel())
//                            .build();
//                    employeeSkillRepo.save(employeeSkill);
//                }
//
//
//            }
//        }
//        return savedUser;
//    }

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

    // calculate completion of profile setup
    public int profileCompletion(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        int score = 0;

        if(user.getFullName() != null && !user.getFullName().isEmpty()) {
            score += 10;
        }
        if(user.getBio() != null && !user.getBio().isEmpty()) {
            score += 10;
        }
        if(user.getPhone() != null && !user.getPhone().isEmpty()) {
            score += 10;
        }
        if(user.getAddress() != null && !user.getAddress().isEmpty()) {
            score += 10;
        }

        Long count = employeeSkillRepo.countByUserId(userId);
        if(count >= 5) {
            score += 20;
        }
        else{
            score += (int)(count * 4);
        }

        if(user.hasCv()){
            score += 20;
        }

        if(!user.getExperiences().isEmpty()){
            score += 10;
        }
        if(!user.getEducation().isEmpty()){
            score += 10;
        }

        return score;
    }

    // Count skills user has
    public Long countSkill(Long userId){
        return employeeSkillRepo.countByUserId(userId);
    }


}
