package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.JobRequest;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.JobSkill;
import org.example.jobboard.model.Skill;
import org.example.jobboard.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;


    // POST
    // api/jobs
    @PostMapping
    public ResponseEntity<Job> postJob (@RequestBody JobRequest jobRequest) {
        Job jobData = Job.builder()
                .title(jobRequest.getTitle()).description(jobRequest.getDescription())
                .minSalary(jobRequest.getMinSalary()).maxSalary(jobRequest.getMaxSalary())
                .location(jobRequest.getLocation())
                .build();


        List<JobSkill> requiredSkill = jobRequest.getSkills().stream().map(s -> {
            Skill skill = Skill.builder().id(s.getSkillId()).build();
            return JobSkill.builder().skill(skill).importanceLevel(s.getImportanceLevel())
                    .build();
        }).toList();
        Job savedJob = jobService.postJob(jobRequest.getEmployerId(), jobData, requiredSkill);
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
