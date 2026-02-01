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
@RequestMapping("/api/employers/")
public class EmployerController {
    private final UserRepo userRepo;

    // POST
    // api/employer/profile
    @PostMapping("/profile")
    public ResponseEntity<User> creteProfile(@RequestBody EmployerProfileRequest employerProfileRequest) {
        // Existing user
        User user = userRepo.findById(employerProfileRequest.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        // Add field
        user.setCompanyName(employerProfileRequest.getCompanyName());
        user.setCompanyWebsite(employerProfileRequest.getCompanyWebsite());
        user.setDescription(employerProfileRequest.getDescription());
        return ResponseEntity.ok(userRepo.save(user));
    }
}
