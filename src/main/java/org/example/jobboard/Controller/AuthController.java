package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.AuthResponse;
import org.example.jobboard.dto.Login;
import org.example.jobboard.dto.UserRegisterRequest;
import org.example.jobboard.model.User;
import org.example.jobboard.service.JwtService;
import org.example.jobboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    // POST
    // api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        try{
            // handle auth and token generation
            AuthResponse response = userService.login(login);
            return ResponseEntity.ok(response);
        }
        catch(RuntimeException e){
            if(e.getMessage().contains("pending") || e.getMessage().contains("disabled")){
                return ResponseEntity.status(403).body(e.getMessage());
            }
            else if(e.getMessage().contains("Incorrect")){
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest userRegisterRequest) {
        try{
            return ResponseEntity.ok(userService.register(userRegisterRequest));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
