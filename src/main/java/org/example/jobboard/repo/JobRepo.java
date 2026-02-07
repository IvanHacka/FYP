package org.example.jobboard.repo;

import org.example.jobboard.model.Job;
import org.example.jobboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface JobRepo extends JpaRepository<Job, Long>{
    List<Job> findByStatus(Job.JobStatus status); // example -> get all OPEN
    List<Job> findByEmployerId(Long id); // Get job posted by the employer

    // search feature with SQL Query
    // status = "OPEN"
    // 1. title
    // 2. location
    // 3. set minmun salary
    @Query("SELECT j FROM Job j WHERE j.status = :status AND (:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%')))" +
            "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))" +
            "AND (:minSalary IS NULL OR j.minSalary >= :minSalary)")
    List<Job> search(@Param("status") Job.JobStatus status, @Param("title") String title, @Param("location") String location, @Param("minSalary") BigDecimal minSalary);
}
