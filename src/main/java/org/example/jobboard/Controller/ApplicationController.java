package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.*;
import org.example.jobboard.model.Application;
import org.example.jobboard.model.Document;
import org.example.jobboard.model.User;
import org.example.jobboard.service.ApplicationService;
import org.example.jobboard.service.MatchingService;
import org.example.jobboard.service.UserService;
import org.example.jobboard.util.FileStorageUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;

import java.nio.file.Paths;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final UserService userService;
    private final MatchingService matchingService;
    private final FileStorageUtil fileStorageUtil;

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



    // GET
    // api/applications/employee
    @GetMapping("/employee")
    public ResponseEntity<List<EmployeeApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User applicant = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(applicationService.getMyApplications(applicant.getId()));
    }


    // PUT
    // api/{applicationId}/status
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<UpdateApplicationStatusResponse> updateStatus(@PathVariable Long applicationId,
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

    @GetMapping("/{applicationId}/documents/{documentId}/download")
    public ResponseEntity<Resource> downloadApplicantDocument(@PathVariable Long applicationId,
                                                              @PathVariable Long documentId,
                                                              @AuthenticationPrincipal UserDetails userDetails
    ) {
        User employer = userService.getUserByEmail(userDetails.getUsername());

        Document document = applicationService.getApplicantDocumentForEmployer(
                applicationId,
                documentId,
                employer.getId()
        );

        Resource resource = fileStorageUtil.loadFileAsResource(Paths.get(document.getFilePath()).getFileName().toString());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getDocumentName() + "\"")
                .body(resource);
    }


    // GET
    // api/{applicationId}/timeline
    @GetMapping("/{applicationId}/timeline")
    public ResponseEntity<List<ApplicationStatusHistoryResponse>> getApplicationTimeline(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(applicationService.getApplicationTimeline(applicationId, user.getId(), user.getRole()));
    }

}

