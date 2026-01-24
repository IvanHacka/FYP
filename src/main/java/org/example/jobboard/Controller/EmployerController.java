package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployerProfileRequest;
import org.example.jobboard.model.Employer;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EmployerRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employer/")
public class EmployerController {
    private final EmployerRepo employerRepo;
    private final UserRepo userRepo;

    // POST
    // api/employer/profile
    @PostMapping("/profile")
    public ResponseEntity<Employer> creteProfile(@RequestBody EmployerProfileRequest employerProfileRequest) {
        User user = userRepo.findById(employerProfileRequest.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Employer employer = Employer.builder().user(user)
                .companyName(employerProfileRequest.getCompanyName())
                .companyWebsite(employerProfileRequest.getCompanyWebsite())
                .description(employerProfileRequest.getDescription())
                .build();

        return ResponseEntity.ok(employerRepo.save(employer));
    }
}
