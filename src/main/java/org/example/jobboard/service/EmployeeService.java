package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployeeProfileRequest;
import org.example.jobboard.dto.EmployeeSkillRequest;
import org.example.jobboard.dto.SkillRequest;
import org.example.jobboard.model.Employee;
import org.example.jobboard.model.EmployeeSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EmployeeRepo;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.SkillRepo;
import org.example.jobboard.repo.UserRepo;
import org.example.jobboard.util.FileStorageUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepo employeeRepo;
    private final UserRepo userRepo;
    private final SkillRepo skillRepo;
    private final EmployeeSkillRepo employeeSkillRepo;
    private final FileStorageUtil fileStorageUtil;


    // Profile and skills save together
    @Transactional
    public Employee createProfile(EmployeeProfileRequest employeeProfileRequest) {
        User user = userRepo.findById(employeeProfileRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Employee employee = Employee.builder().user(user)
                .fullName(employeeProfileRequest.getFullName())
                .cv(employeeProfileRequest.getCv())
                .bio(employeeProfileRequest.getBio())
                .build();
        Employee savedEmployee = employeeRepo.save(employee);

        if(employeeProfileRequest.getSkills() != null) {
            for(EmployeeSkillRequest skillRequest: employeeProfileRequest.getSkills()) {
                Skill skill = skillRepo.findById(skillRequest.getSkillId())
                        .orElseThrow(() -> new RuntimeException("Skill id " + skillRequest.getSkillId() + " not found"));

                EmployeeSkill employeeSkill = EmployeeSkill.builder()
                        .employee(savedEmployee)
                        .skill(skill)
                        .proficiencyLevel(skillRequest.getProficiencyLevel())
                        .build();


                employeeSkillRepo.save(employeeSkill);
            }
        }
        return savedEmployee;
    }

    // CV upload with FileStorageUtil
    public Employee cvUpload(Long employeeId, MultipartFile file) {
        try{
            String fileName = fileStorageUtil.saveFile(file);
            Employee employee = employeeRepo.findById(employeeId).orElseThrow
                    (() -> new RuntimeException("Employee not found"));
            employee.setCv(fileName);
            return employeeRepo.save(employee);
        }
        catch (Exception e) {
            throw new RuntimeException("Having trouble saving file. Error: ", e);
        }
    }
}
