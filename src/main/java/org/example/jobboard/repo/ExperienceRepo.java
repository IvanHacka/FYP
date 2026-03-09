package org.example.jobboard.repo;

import org.example.jobboard.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ExperienceRepo extends JpaRepository<Experience, Long> {
    // Find all experiences with user id
    // From the recent one
    /**
     *
     * @param userId
     * @return List<Experience></Experience>
     */
    List<Experience> findByUserIdOrderByStartDateDesc(Long userId);

    // Find


}
