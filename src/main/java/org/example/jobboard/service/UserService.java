package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.AuthResponse;
import org.example.jobboard.dto.Login;
import org.example.jobboard.dto.UserRegisterRequest;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final JwtService jwtService;

    // Password hash
    private final PasswordEncoder passwordEncoder;

    public User register(UserRegisterRequest userRegisterRequest) {
        if(userRepo.existsByEmail(userRegisterRequest.getEmail())) {
            // check if the email exist
            // return error message if so
            throw new RuntimeException("Email address already in use");
        }
        String companyName = null;
        if(userRegisterRequest.getRole() == User.Role.EMPLOYER) {
            if(userRegisterRequest.getCompanyName() == null || userRegisterRequest.getCompanyName().isEmpty()) {
                throw new IllegalArgumentException("Company name cannot be empty for Employers");
            }
            companyName = userRegisterRequest.getCompanyName();
        }

        // build to match User.java
        User user = User.builder().fullName(userRegisterRequest.getFullName())
                .email(userRegisterRequest.getEmail())
                .password(passwordEncoder.encode(userRegisterRequest.getPassword()))
                .role(userRegisterRequest.getRole())
                // Employer -> lock account first
                // Employee -> auto approved
                .isActive(userRegisterRequest.getRole() != User.Role.EMPLOYER)
                .companyName(companyName)
                .build();


        return userRepo.save(user);
    }

    public AuthResponse login(Login login) {
        // Find User
        User user = userRepo.findByEmail(login.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));
        // Check Password
        if (!passwordEncoder.matches(login.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect email or password");
        }
        // Check if Approved
        if (!user.isActive()) {
            throw new RuntimeException("Account is pending approval");
        }
        // Generate Token
        String token = jwtService.generateToken(user.getUsername());

        // Return the Response DTO to forntend
        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getEmail()
        );
    }

}
