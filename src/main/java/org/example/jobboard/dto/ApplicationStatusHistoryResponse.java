package org.example.jobboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationStatusHistoryResponse {
    private Long id;
    private String oldStatus;
    private String newStatus;
    private String employerNotes;
    private LocalDateTime changedAt;

    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime shortlistedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime withdrawnAt;
}