package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepo userRepo;

    // GET
    // /api/pending
    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPending(){
        return ResponseEntity.ok(userRepo.findByRoleAndIsActive(User.Role.EMPLOYER, false));
    }

    // PUT
    // /api/approveEmployers?userId=?
    @PutMapping("/approveEmployers/{userId}")
    public ResponseEntity<String> approveEmployers(@PathVariable Long userId){
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        userRepo.save(user);
        return ResponseEntity.ok("User approved");
    }
}
