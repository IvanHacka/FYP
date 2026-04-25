package org.example.jobboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "preferences")
public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @CollectionTable(name = "desired_job_titles", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "job_title")
    private String desiredJobTitles;

    @CollectionTable(name = "preferred_locations", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "location")
    private String preferredLocations;

    @Column(name = "min_expected_salary")
    private BigDecimal minExpectedSalary;

    @Column(name = "max_expected_salary")
    private BigDecimal maxExpectedSalary;

    @Column(name = "available_start_date")
    private LocalDate availableStartDate;

    @ElementCollection
    @CollectionTable(name = "preferred_job_types", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "job_type")
    @Enumerated(EnumType.STRING)
    private List<Job.JobType> jobTypes;

    @Column(name = "willing_to_relocate")
    private Boolean willingToRelocate = false;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
