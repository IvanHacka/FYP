package org.example.jobboard.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateExpiryRequest {
    private LocalDateTime expiresAt;
}
