package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.ApplicationRequest;
import org.example.jobboard.model.Application;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.ApplicationRepo;
import org.example.jobboard.service.ApplicationService;
import org.example.jobboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final UserService userService;
//    public ApplicationController(ApplicationService applicationService) {
//        this.applicationService = applicationService;
//    }


    // Post
    // /api/application/apply
    @PostMapping("/apply")
    // JSON data !!
    public ResponseEntity<Application> jobApply(@RequestBody ApplicationRequest applicationRequest) {
        Application application = applicationService.jobApply(
                applicationRequest.getJobId(), applicationRequest.getUserId());
        return ResponseEntity.ok(application);
    }

    // GET
    // /api/applications/job/
    @GetMapping("/employer")
    public ResponseEntity<List<Application>> getApplicationJob(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User employer = userService.getUserByEmail(email);
        return ResponseEntity.ok(applicationService.getApplicationByCompany(employer.getId()));
    }

    // GET
    // /api/applications/{jobId}
    @GetMapping("/{jobId}")
    public ResponseEntity<List<Application>> getApplication(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId));
    }
}
