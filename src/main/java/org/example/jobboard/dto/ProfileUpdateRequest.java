package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {
    private String fullName;
    private String bio;
    private String phone;
    private String address;
    private String linkedInUrl;
    private String portfolioUrl;
}
