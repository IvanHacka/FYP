package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployeeProfileRequest;
import org.example.jobboard.dto.EmployeeSkillRequest;
import org.example.jobboard.dto.SkillRequest;
import org.example.jobboard.model.EmployeeSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.SkillRepo;
import org.example.jobboard.repo.UserRepo;
import org.example.jobboard.util.FileStorageUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepo userRepo;
    private final SkillRepo skillRepo;
    private final EmployeeSkillRepo employeeSkillRepo;
    private final FileStorageUtil fileStorageUtil;


    // Profile and skills save together
    @Transactional
    public User createProfile(EmployeeProfileRequest employeeProfileRequest, String email) {
        User user = userRepo.findById(employeeProfileRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(employeeProfileRequest.getFullName() != null) {
            user.setFullName(employeeProfileRequest.getFullName());
        }
        if(employeeProfileRequest.getBio() != null) {
            user.setBio(employeeProfileRequest.getBio());
        }
        User savedUser = userRepo.save(user);

        // handle skills
        if(employeeProfileRequest.getSkills() != null) {
            for(EmployeeSkillRequest req: employeeProfileRequest.getSkills()){
                Skill skill = skillRepo.findById(req.getSkillId()).orElseThrow(
                        () -> new RuntimeException("Skill not found"));

                EmployeeSkill employeeSkill = EmployeeSkill.builder()
                        .user(savedUser)
                        .skill(skill)
                        .proficiencyLevel(req.getProficiencyLevel())
                        .build();

                employeeSkillRepo.save(employeeSkill);
            }
        }
        return savedUser;
    }

    // CV upload with FileStorageUtil
    public User cvUpload(Long employeeId, MultipartFile file) {
        try{
            String fileName = fileStorageUtil.saveFile(file);
            User user = userRepo.findById(employeeId).orElseThrow
                    (() -> new RuntimeException("Employee not found"));
            user.setCv(fileName);
            return userRepo.save(user);
        }
        catch (Exception e) {
            throw new RuntimeException("Having trouble saving file. Error: ", e);
        }
    }

    public void addSkill(Long userId, Long skillId, int proficiency) {
        User user = userRepo.findById(userId).orElseThrow();
        Skill skill = skillRepo.findById(skillId).orElseThrow();

        EmployeeSkill employeeSkill = new EmployeeSkill();
        employeeSkill.setUser(user); // Updated to setUser (was setEmployee)
        employeeSkill.setSkill(skill);
        employeeSkill.setProficiencyLevel(proficiency);

        employeeSkillRepo.save(employeeSkill);
    }
}
