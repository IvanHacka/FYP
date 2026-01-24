package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
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

    // Password hash
    private final PasswordEncoder passwordEncoder;

    public User register(UserRegisterRequest userRegisterRequest) {
        if(userRepo.existsByEmail(userRegisterRequest.getEmail())) {
            // check if the email exist
            // return error message if so
            throw new RuntimeException("Email address already in use");
        }
        User user = User.builder().email(userRegisterRequest.getEmail())
                .password(passwordEncoder.encode(userRegisterRequest.getPassword()))
                .role(userRegisterRequest.getRole())
                .build();
        return userRepo.save(user);
    }

    public User login(Login login) {
        User user = userRepo.findByEmail(login.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));
        if(!user.getPassword().equals(login.getPassword())) {
            throw new RuntimeException("Incorrect email or password");
        }

        return user;
    }

}
