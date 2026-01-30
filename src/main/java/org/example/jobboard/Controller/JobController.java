package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.JobRequest;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.JobSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.UserRepo;
import org.example.jobboard.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;
    private final UserRepo userRepo;


    // POST
    // api/jobs
    @PostMapping
    // employer
    public ResponseEntity<Job> postJob (@RequestBody JobRequest jobRequest, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if(user.getRole() != User.Role.EMPLOYER){
            return ResponseEntity.status(403).build();
        }
        Job jobData = Job.builder()
                .title(jobRequest.getTitle()).description(jobRequest.getDescription())
                .minSalary(jobRequest.getMinSalary())
                .location(jobRequest.getLocation()).status(Job.JobStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();


        List<JobSkill> requiredSkill = new ArrayList<>();
        if(jobRequest.getSkills() != null){
            requiredSkill = jobRequest.getSkills().stream().map(s -> {
                Skill skill = Skill.builder().id(s.getSkillId()).build();
                return JobSkill.builder().skill(skill).importanceLevel(s.getImportanceLevel())
                        .build();
            }).toList();

        }

        Job savedJob = jobService.postJob(user.getId(), jobData, requiredSkill);
        return ResponseEntity.ok(savedJob);
    }

    // GET
    // api/jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllOPENJobs() {
        return ResponseEntity.ok(jobService.getAllOPENJobs());
    }

    // GET
    // api/jobs/search?title=?&location=?&salary=?
    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam(required = false) String title,
                                                @RequestParam(required = false) String location,
                                                @RequestParam(required = false) BigDecimal salary)
    {
        return ResponseEntity.ok(jobService.searchJobs(title, location, salary));
    }
}
