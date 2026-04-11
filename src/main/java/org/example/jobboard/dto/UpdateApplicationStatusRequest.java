package org.example.jobboard.dto;

import lombok.Data;
import org.example.jobboard.model.Application;

@Data
public class UpdateApplicationStatusRequest {
    private Application.ApplicationStatus status;
    private String employerNotes;
}
