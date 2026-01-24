package org.example.jobboard.repo;

import org.example.jobboard.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepo extends JpaRepository<Job, Long>{
    List<Job> findByStatus(Job.JobStatus status); // example -> get all OPEN
    List<Job> findByEmployerId(Long id); // Get job posted by the employer
}
