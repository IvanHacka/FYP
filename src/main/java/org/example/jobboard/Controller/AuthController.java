package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.AuthResponse;
import org.example.jobboard.dto.Login;
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
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword())
            );
            User user = (User) userDetailsService.loadUserByUsername(login.getEmail());
            String token = jwtService.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId(), user.getUsername()));
        }
        catch(DisabledException e){
            return ResponseEntity.status(403).body("Account disabled. Please wait for approval.");
        }
        catch(BadCredentialsException e){
            return ResponseEntity.status(401).body("Invalid email or password.");
        }
        }
}
