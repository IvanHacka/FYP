package org.example.jobboard.service;

import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.WatchListResponse;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.User;
import org.example.jobboard.model.WatchList;
import org.example.jobboard.repo.JobRepo;
import org.example.jobboard.repo.UserRepo;
import org.example.jobboard.repo.WatchListRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchListService {
    private final WatchListRepo watchListRepo;
    private final UserRepo userRepo;
    private final JobRepo jobRepo;
    private final MatchingService matchingService;

    public WatchList saveJob(Long userId, Long jobId) {
        if (watchListRepo.existsByUserIdAndJobId(userId, jobId)) {
            throw new RuntimeException("Job already saved");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        WatchList watchList = WatchList.builder()
                .user(user)
                .job(job)
                .build();

        return watchListRepo.save(watchList);
    }

    public List<WatchListResponse> getWatchLists(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return watchListRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(item -> {
                    Job job = item.getJob();
                    BigDecimal matchScore = matchingService.calculateMatchScore(job.getId(), user.getId());

                    return new WatchListResponse(
                            item.getId(),
                            job.getId(),
                            job.getTitle(),
                            job.getLocation(),
                            job.getDescription(),
                            job.getMinSalary(),
                            item.getCreatedAt(),
                            matchScore
                    );
                })
                .toList();
    }

    public void removeSavedJob(Long userId, Long jobId) {
        WatchList savedJob = watchListRepo.findByUserIdAndJobId(userId, jobId)
                .orElseThrow(() -> new RuntimeException("Saved job not found"));

        watchListRepo.delete(savedJob);
    }
}
