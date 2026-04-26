package org.example.jobboard.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "applications")
public class Application {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User applicant;

    @Column(name = "match_score")
    private BigDecimal matchScore;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

//    @Column(columnDefinition = "TEXT")
//    private String coverLetter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cover_letter_document_id")
    private Document coverLetterDocument;

    @Column(name = "expected_salary")
    private BigDecimal expectedSalary;

    @Column(name = "available_start_date")
    private LocalDate availableStartDate;


    // A question I usually get asked
    @Column(name = "why_good_fit", columnDefinition = "TEXT")
    private String whyGoodFit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(name = "employer_notes", columnDefinition = "TEXT")
    private String employerNotes;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "shortlisted_at")
    private LocalDateTime shortlistedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "withdrawn_at")
    private LocalDateTime withdrawnAt;

    // Status enum
    public enum ApplicationStatus {
        SUBMITTED,
        UNDER_REVIEW,
        SHORTLISTED,
        REJECTED,
        ACCEPTED,
        WITHDRAWN,
    }
}
