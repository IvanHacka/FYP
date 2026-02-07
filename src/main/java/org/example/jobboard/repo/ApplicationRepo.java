package org.example.jobboard.repo;


import org.example.jobboard.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepo extends JpaRepository<Application, Long>{
    List<Application> findByJobId(Long id);
    // Find who apply to the job

    List<Application> findByApplicantId(Long id);
    // Find what jobs the applicant applied to

    List<Application> findByJobEmployerId(Long id);
    // Find the applicants who match employer id with the job

    boolean existsByApplicantIdAndJobId(Long employeeId, Long jobId);
    // Check if an employee has applied to the job
                                                                        // Prevent duplicate applications

}
