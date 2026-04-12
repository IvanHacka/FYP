package org.example.jobboard.Controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.JobSkillRequest;
import org.example.jobboard.dto.JobSkillResponse;
import org.example.jobboard.dto.UpdateJobSkillRequest;
import org.example.jobboard.model.User;
import org.example.jobboard.service.JobSkillService;
import org.example.jobboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/jobSkills")
public class JobSkillController {
    private final JobSkillService jobSkillService;
    private final UserService userService;

    @PostMapping("/{jobId}")
    public ResponseEntity<JobSkillResponse> addJobSkill(
            @PathVariable Long jobId,
            @Valid @RequestBody JobSkillRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User employer = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(jobSkillService.addJobSkill(request, jobId, employer.getId()));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<List<JobSkillResponse>> getJobSkills(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobSkillService.getAllJobSkills(jobId));
    }

    @PutMapping("/{jobSkillId}")
    public ResponseEntity<JobSkillResponse> updateJobSkill(
            @PathVariable Long jobSkillId,
            @Valid @RequestBody UpdateJobSkillRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User employer = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(
                jobSkillService.updateJobSkill(jobSkillId, employer.getId(), request.getImportanceLevel())
        );
    }

    @DeleteMapping("/{jobSkillId}")
    public ResponseEntity<Void> deleteJobSkill(
            @PathVariable Long jobSkillId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User employer = userService.getUserByEmail(userDetails.getUsername());
        jobSkillService.deleteJobSkill(jobSkillId, employer.getId());
        return ResponseEntity.noContent().build();
    }

}
