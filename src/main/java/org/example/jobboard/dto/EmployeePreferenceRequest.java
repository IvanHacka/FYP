package org.example.jobboard.dto;


import lombok.Data;
import org.example.jobboard.model.Job;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class EmployeePreferenceRequest {
    private String desiredJobTitle;
    private String preferredLocations;
    private BigDecimal minExpectedSalary;
    private List<Job.JobType> jobTypes;
    private LocalDate availableStartDate;
    private Boolean willingToRelocate;

}
