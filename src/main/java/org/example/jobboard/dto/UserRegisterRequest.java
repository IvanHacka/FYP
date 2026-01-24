package org.example.jobboard.dto;

import org.example.jobboard.model.User.Role;


import lombok.Data;

@Data
public class UserRegisterRequest {
    private String email;
    private String password;
    private Role role;
}
