package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.Login;
import org.example.jobboard.model.User;
import org.example.jobboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Login login) {
        User user = userService.login(login); // JavaScript look at the role and token
        return ResponseEntity.ok(user);
    }
}
