package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.UserRegisterRequest;
import org.example.jobboard.model.User;
import org.example.jobboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/")
public class UserController {
    private final UserService userService;

    // POST
    // /api/users/register
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegisterRequest userRegisterRequest) {
        return ResponseEntity.ok(userService.register(userRegisterRequest));
    }
}
