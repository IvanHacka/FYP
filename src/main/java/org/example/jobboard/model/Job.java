package org.example.jobboard.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "jobs")


public class Job {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User employer;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_salary")
    private BigDecimal minSalary;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;


    // 2 column
    // a list of skills
    // job id to indicate which job requires what skills
    @ElementCollection
    @CollectionTable(name = "job_required_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill_name")
    private List<String> requiredSkills = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", length = 50)
    private JobType jobType;

    public enum JobStatus {
        OPEN,
        CLOSED,
        EXPIRED,
    }

    // Years of experience
    // Entry = 0-1
    // Junior = 1-3
    // MID = 3-5
    // Senior = 5-10
    public enum ExperienceLevel {
        ENTRY,
        JUNIOR,
        MID,
        SENIOR

    }
    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        INTERNSHIP,
        REMOTE

    }
}



