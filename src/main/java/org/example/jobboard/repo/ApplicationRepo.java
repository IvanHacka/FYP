package org.example.jobboard.repo;


import org.example.jobboard.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepo extends JpaRepository<Application, Long>{
    // Find who apply to the job
    List<Application> findByJobIdOrderByCreatedAtDesc(Long employerId);

    // Find applications history
    List<Application> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    Optional<Application> findByIdAndApplicantId(Long applicationId, Long applicantId);

    Optional<Application> findByIdAndJobEmployerId(Long applicationId, Long employerId);


    List<Application> findByJobEmployerId(Long id);
    // Find the applicants who match employer id with the job

    boolean existsByApplicantIdAndJobId(Long employeeId, Long jobId);
    // Check if an employee has applied to the job
                                                                        // Prevent duplicate applications

}
