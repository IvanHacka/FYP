package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.Application;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.ApplicationRepo;
import org.example.jobboard.repo.JobRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepo applicationRepo;
    private final JobRepo jobRepo;
    private final UserRepo userRepo;
    private final MatchingService matchingService;

    public Application jobApply(Long jobId, Long userId) {

        if (applicationRepo.existsByApplicantIdAndJobId(jobId, userId)) {
            throw new RuntimeException(
                    "You have already applied for the job with id " + jobId);
        }
        // Find job
        Job job = jobRepo.findById(jobId).orElseThrow(() ->
                new RuntimeException("Job with id " + jobId + " not found"));
        // Find applicant
        User user = userRepo.findById(userId).orElseThrow(() ->
                new RuntimeException("Applicant " + userId + " not found"));

        BigDecimal score = matchingService.calculateMatchScore(jobId, userId);
        Application application = Application.builder()
                .job(job).applicant(user).matchScore(score).build();
        return applicationRepo.save(application);
    }

    public List<Application> getApplicationByCompany(Long employerId) {
        return applicationRepo.findByApplicantId(employerId);
    }

}
