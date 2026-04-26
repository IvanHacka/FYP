package org.example.jobboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InactiveUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private LocalDateTime lastLoginAt;
    private long daysInactive;
    private Boolean warningEmailSent;
    private Boolean reviewEmailSent;
    private Boolean isActive;
}
