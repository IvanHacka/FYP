package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EducationRequest;
import org.example.jobboard.dto.EducationResponse;
import org.example.jobboard.model.User;
import org.example.jobboard.service.EducationService;
import org.example.jobboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
public class EducationController {
    private final EducationService educationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<EducationResponse>> getMyEducation(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(educationService.getMyEducation(user.getId()));
    }

    @PostMapping
    public ResponseEntity<EducationResponse> addEducation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody EducationRequest request
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(educationService.addEducation(user.getId(), request));
    }

    @PutMapping("/{educationId}")
    public ResponseEntity<EducationResponse> updateEducation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long educationId,
            @RequestBody EducationRequest request
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(educationService.updateEducation(user.getId(), educationId, request));
    }

    @DeleteMapping("/{educationId}")
    public ResponseEntity<Void> deleteEducation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long educationId
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        educationService.deleteEducation(user.getId(), educationId);
        return ResponseEntity.noContent().build();
    }
}
