package org.example.jobboard.Controller;


import org.example.jobboard.dto.ApplicationRequest;
import org.example.jobboard.model.Application;
import org.example.jobboard.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }


    // Post
    // /api/application/apply
    @PostMapping("/apply")
    public ResponseEntity<Application> jobApply(@RequestBody ApplicationRequest applicationRequest) {
        Application application = applicationService.jobApply(
                applicationRequest.getJobId(), applicationRequest.getEmployeeId());
        return ResponseEntity.ok(application);
    }
}
