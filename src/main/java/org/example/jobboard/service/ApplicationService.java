package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.Application;
import org.example.jobboard.model.Employee;
import org.example.jobboard.model.Job;
import org.example.jobboard.repo.ApplicationRepo;
import org.example.jobboard.repo.EmployeeRepo;
import org.example.jobboard.repo.JobRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepo applicationRepo;
    private final JobRepo jobRepo;
    private final EmployeeRepo employeeRepo;
    private final MatchingService matchingService;

    public Application jobApply(Long jobId, Long employeeId) {

        if (applicationRepo.existsByEmployeeIdAndJobId(jobId, employeeId)) {
            throw new RuntimeException("Employee " + employeeId +
                    " have already applied for the job with id " + jobId);
        }
        Job job = jobRepo.findById(jobId).orElseThrow(() ->
                new RuntimeException("Job with id " + jobId + " not found"));
        Employee employee = employeeRepo.findById(employeeId).orElseThrow(() ->
                new RuntimeException("Employee " + employeeId + " not found"));

        BigDecimal score = matchingService.calculateMatchScore(jobId, employeeId);
        Application application = Application.builder()
                .job(job).employee(employee).matchScore(score).build();
        return applicationRepo.save(application);
    }

}
