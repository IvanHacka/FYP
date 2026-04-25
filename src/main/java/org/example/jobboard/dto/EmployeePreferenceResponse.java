package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobboard.model.Job;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeePreferenceResponse {
    private String desiredJobTitle;
    private String preferredLocations;
    private BigDecimal minExpectedSalary;
    private List<Job.JobType> jobTypes;
    private LocalDate availableStartDate;
    private Boolean willingToRelocate;
}
