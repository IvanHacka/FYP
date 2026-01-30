package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.ApplicationRequest;
import org.example.jobboard.model.Application;
import org.example.jobboard.repo.ApplicationRepo;
import org.example.jobboard.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final ApplicationRepo applicationRepo;

//    public ApplicationController(ApplicationService applicationService) {
//        this.applicationService = applicationService;
//    }


    // Post
    // /api/application/apply
    @PostMapping("/apply")
    public ResponseEntity<Application> jobApply(@RequestBody ApplicationRequest applicationRequest) {
        Application application = applicationService.jobApply(
                applicationRequest.getJobId(), applicationRequest.getEmployeeId());
        return ResponseEntity.ok(application);
    }

    // GET
    // /api/applications/job/?
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationRepo.findByJobId(jobId));
    }
}
