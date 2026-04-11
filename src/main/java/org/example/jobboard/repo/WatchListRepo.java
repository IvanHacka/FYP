package org.example.jobboard.repo;

import org.example.jobboard.model.WatchList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchListRepo extends JpaRepository<WatchList, Long> {
    List<WatchList> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    Optional<WatchList> findByUserIdAndJobId(Long userId, Long jobId);
}
