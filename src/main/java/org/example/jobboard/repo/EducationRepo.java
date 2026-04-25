package org.example.jobboard.repo;

import org.example.jobboard.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationRepo extends JpaRepository<Education, Long> {
    List<Education> findByUserIdOrderByStartDateDesc(Long userId);
}
