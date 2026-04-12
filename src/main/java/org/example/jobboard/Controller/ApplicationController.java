package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.ApplicationsResponse;
import org.example.jobboard.dto.ApplyJobRequest;
import org.example.jobboard.dto.MatchScoreBreakdownRequest;
import org.example.jobboard.dto.UpdateApplicationStatusRequest;
import org.example.jobboard.model.Application;
import org.example.jobboard.model.User;
import org.example.jobboard.service.ApplicationService;
import org.example.jobboard.service.MatchingService;
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
    private final MatchingService matchingService;

    ////    public ApplicationController(ApplicationService applicationService) {
////        this.applicationService = applicationService;
////    }
//
//
    // Post
    // /api/application/apply
    @PostMapping("/apply")
    //JSON DATA!!!
    public ResponseEntity<Application> jobApply(@RequestBody ApplyJobRequest request,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        User applicant = userService.getUserByEmail(userDetails.getUsername());

        Application application = applicationService.jobApply(
                request.getJobId(),
                applicant.getId(),
                request.getWhyGoodFit()
        );

        return ResponseEntity.ok(application);
    }

    // GET
    // /api/applications/job/
    @GetMapping("/employer")
    public ResponseEntity<List<ApplicationsResponse>> getApplicationJob(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User employer = userService.getUserByEmail(email);
        return ResponseEntity.ok(applicationService.getApplicationByCompany(employer.getId()));
    }

    // GET
    // /api/applications/{jobId}
    @GetMapping("/{jobId}")
    public ResponseEntity<List<ApplicationsResponse>> getApplication(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId));
    }



    @GetMapping("/employee")
    public ResponseEntity<List<Application>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User applicant = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(applicationService.getMyApplications(applicant.getId()));
    }


    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long applicationId,
                                                    @RequestBody UpdateApplicationStatusRequest request,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        User employer = userService.getUserByEmail(userDetails.getUsername());

        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(
                        applicationId,
                        employer.getId(),
                        request.getStatus(),
                        request.getEmployerNotes()
                )
        );
    }

    @PutMapping("/{applicationId}/withdraw")
    public ResponseEntity<Application> withdrawApplication(@PathVariable Long applicationId,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        User applicant = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(
                applicationService.withdrawApplication(applicationId, applicant.getId())
        );
    }

    // Let applicant preview match score against the job they applying to
    @GetMapping("/matchScore/{jobId}")
    public ResponseEntity<MatchScoreBreakdownRequest> matchScoreBreakdowns(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        User applicant = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(matchingService.calculateBreakdowns(jobId, applicant.getId()));
    }

}

