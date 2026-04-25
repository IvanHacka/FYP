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
public class UpdateApplicationStatusResponse {
    private Long applicationId;
    private String status;
    private String employerNotes;
    private LocalDateTime reviewedAt;
    private LocalDateTime shortlistedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime withdrawnAt;
}
