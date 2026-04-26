package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.InactiveUserResponse;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepo userRepo;

    // GET
    // /api/admin/pending
    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPending(){
        return ResponseEntity.ok(userRepo.findByRoleAndIsActive(User.Role.EMPLOYER, false));
    }

    // PUT
    // /api/admin/approveEmployers?userId=?
    @PutMapping("/approveEmployers/{userId}")
    public ResponseEntity<String> approveEmployers(@PathVariable Long userId){
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        userRepo.save(user);
        return ResponseEntity.ok("User approved");
    }
    
    // GET
    // api/admin/inactive
    @GetMapping("/inactive")
    public ResponseEntity<?> getInactive(){
        LocalDateTime fortyDays = LocalDateTime.now().minusDays(40);
        // Specify 40 days
        List<User> inactive = userRepo.findInactiveUsersForAdmin(fortyDays);
        List<InactiveUserResponse> r = inactive.stream()
                .map(user -> InactiveUserResponse.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .lastLoginAt(user.getLastLoginAt())
                        .daysInactive(Duration.between(user.getLastLoginAt(), LocalDateTime.now()).toDays())
                        .warningEmailSent(user.getWarningEmailSent())
                        .reviewEmailSent(user.getReviewEmailSent())
                        .isActive(user.isEnabled())
                        .build())
                .toList();

        return ResponseEntity.ok(r);
    }


    // PUT
    // api/admin/inactive/{userId}/ban
    @PutMapping("/inactive/{userId}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "User banned",
                "userId", userId
        ));
    }

    // PUT
    // api/inactive/{userId}/reactivate
    // reactive banned user
    @PutMapping("/inactive/{userId}/reactivate")
    public ResponseEntity<?> reactivateUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(true);
        user.setLastLoginAt(LocalDateTime.now());
        user.setWarningEmailSent(false);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "User reactivated",
                "userId", userId
        ));
    }

    // user list for admin page
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepo.findAll();

        List<Map<String, Object>> response = users.stream()
            .map(user -> {
                Map<String, Object> info = new HashMap<>();
                info.put("id", user.getId());
                info.put("fullName", user.getFullName());
                info.put("email", user.getEmail());
                info.put("role", user.getRole());
                info.put("isActive", user.isActive());
                info.put("createdAt", user.getCreatedAt());
                info.put("lastLoginAt", user.getLastLoginAt());
                return info;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
