package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.WatchListResponse;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.User;
import org.example.jobboard.model.WatchList;
import org.example.jobboard.service.UserService;
import org.example.jobboard.service.WatchListService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/watchList")
public class WatchListController {
    private final WatchListService watchListService;
    private final UserService userService;

    @PostMapping("/{jobId}")
    public ResponseEntity<WatchList> saveJob(@PathVariable Long jobId,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(watchListService.saveJob(user.getId(), jobId));
    }

    @GetMapping
    public ResponseEntity<List<WatchListResponse>> getWatchLists(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(watchListService.getWatchLists(user.getId()));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> removeWatchList(@PathVariable Long jobId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        watchListService.removeSavedJob(user.getId(), jobId);
        return ResponseEntity.noContent().build();
    }
}
