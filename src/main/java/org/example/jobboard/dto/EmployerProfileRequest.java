package org.example.jobboard.dto;


import lombok.Data;

@Data
public class EmployerProfileRequest {
    private Long userId;
    private String companyName;
    private String companyWebsite;
    private String description;
}
