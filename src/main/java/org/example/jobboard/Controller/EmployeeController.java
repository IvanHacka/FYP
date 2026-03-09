package org.example.jobboard.Controller;


import org.example.jobboard.dto.SkillProficiencyRequest;
import org.example.jobboard.model.EmployeeSkill;
import org.example.jobboard.model.User;
import org.example.jobboard.service.UserService;
import org.example.jobboard.util.FileStorageUtil;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployeeProfileRequest;
import org.example.jobboard.service.EmployeeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController

@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final UserService userService;

    // POST
    // api/employees/profile
    @PostMapping("/profile")
    ResponseEntity<User> createProfile(@RequestBody EmployeeProfileRequest employeeProfileRequest, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(employeeService.createProfile(employeeProfileRequest, userDetails.getUsername()));
    }


    // GET
    // api/employees/profile/completion
    @GetMapping("/profile/completion")
    public ResponseEntity<ProfileCompletionResponse> getProfileCompletion(
            @AuthenticationPrincipal UserDetails userDetails
    ){
        User user = userService.getUserByEmail(userDetails.getUsername());
        int completionScore = employeeService.profileCompletion(user.getId());
        return ResponseEntity.ok(new ProfileCompletionResponse(completionScore));
    }


    // GET
    // api/employees/profile/skills
    @GetMapping("/skills")
    public ResponseEntity<List<EmployeeSkill>> getSkills(
            @AuthenticationPrincipal UserDetails userDetails
    ){
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<EmployeeSkill> skills = employeeService.getUserSkills(user.getId());
        return ResponseEntity.ok(skills);
    }


    // POST
    // // api/employees/profile/skills
    @PostMapping("/skills")
    public ResponseEntity<EmployeeSkill> addSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody SkillProficiencyRequest req) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        EmployeeSkill skill = employeeService.addSkill(
                user.getId(),
                req.getSkillId(),
                req.getProficiencyLevel()
        );
        return ResponseEntity.ok(skill);

    }

    // PUT
    // // api/employees/profile/skills/{skillId}
    @PutMapping("/skills/{skillId}")
    public ResponseEntity<EmployeeSkill> updateSkillProficiency(
            @PathVariable Long skillId,
            @RequestBody SkillProficiencyRequest req,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        User user = userService.getUserByEmail(userDetails.getUsername());
        EmployeeSkill skill = employeeService.updateSkillProficiency(
                user.getId(),
                skillId,
                req.getProficiencyLevel()
        );
        return ResponseEntity.ok(skill);
    }

    // DELETE
    // api/employees/profile/skills/{skillId}
    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<String> deleteSkill(
            @PathVariable Long skillId,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        User user = userService.getUserByEmail(userDetails.getUsername());
        employeeService.deleteSkill(user.getId(), skillId);
        return ResponseEntity.ok().body("Skill deleted successfully");
    }

    // GET
    // api/employees/profile/skills/count
    @GetMapping("/skills/count")
    public ResponseEntity<SkillCountResponse> getSkillsCount(
            @AuthenticationPrincipal UserDetails userDetails
    ){
        User user = userService.getUserByEmail(userDetails.getUsername());
        Long count = employeeService.countSkill(user.getId());
        return ResponseEntity.ok(new SkillCountResponse(count));
    }

    // ----Record DTO
    // To make readable response

    record ProfileCompletionResponse(int completionScore) {}
    record SkillCountResponse(Long count) {}


}
