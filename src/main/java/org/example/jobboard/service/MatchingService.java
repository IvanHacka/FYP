package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.EmployeeSkill;
import org.example.jobboard.model.Job;
import org.example.jobboard.model.User;
import org.example.jobboard.model.JobSkill;
import org.example.jobboard.model.Preference;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.JobRepo;
import org.example.jobboard.repo.JobSkillRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

// Calculate the compatibility between employee (Job seeker) and jobs (match_score)
// 1. See how important is the skills to the job
// 2. Look at the employee's proficiency level on the skill
// Formula -> weighted percentage of importance and proficiency.
// Expert get most (5) and which beginner get least (1)
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final JobSkillRepo jobSkillRepo;
    private final EmployeeSkillRepo employeeSkillRepo;
    private final JobRepo jobRepo;
    private final UserRepo userRepo;

    // Weights
    private static final BigDecimal SKILL_WEIGHT = BigDecimal.valueOf(0.70);
    private static final BigDecimal TITLE_WEIGHT = BigDecimal.valueOf(0.10);
    private static final BigDecimal LOCATION_WEIGHT = BigDecimal.valueOf(0.10);
    private static final BigDecimal SALARY_WEIGHT = BigDecimal.valueOf(0.05);
    private static final BigDecimal JOB_TYPE_WEIGHT = BigDecimal.valueOf(0.05);


    public BigDecimal calculateMatchScore(Long jobId, Long userId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Preference preference = user.getJobPreferences();
        // Each score field
        BigDecimal skillScore = calculateSkillScore(jobId, userId);
        BigDecimal titleScore = calculateTitleScore(job, preference);
        BigDecimal locationScore = calculateLocationScore(job, preference);
        BigDecimal salaryScore = calculateSalaryScore(job, preference);
        BigDecimal jobTypeScore = calculateJobTypeScore(job, preference);

        BigDecimal finalScore = skillScore.multiply(SKILL_WEIGHT)
                .add(titleScore.multiply(TITLE_WEIGHT))
                .add(locationScore.multiply(LOCATION_WEIGHT))
                .add(salaryScore.multiply(SALARY_WEIGHT))
                .add(jobTypeScore.multiply(JOB_TYPE_WEIGHT));

        // Only return 2 digit
        return finalScore.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateSkillScore(Long jobId, Long userId) {
        List<JobSkill> jobSkills = jobSkillRepo.findByJobId(jobId);
        List<EmployeeSkill> employeeSkills = employeeSkillRepo.findByUserId(userId);

        if (jobSkills == null || jobSkills.isEmpty()) {
            return BigDecimal.valueOf(100.00);
        }

        Map<Long, Integer> employeeSkillMap = employeeSkills.stream()
                .filter(s -> s.getSkill() != null && s.getSkill().getId() != null)
                .collect(Collectors.toMap(
                        s -> s.getSkill().getId(),
                        EmployeeSkill::getProficiencyLevel,
                        Math::max // Keep the better one
                ));

        double totalWeight = 0.0;
        double earnedScore = 0.0;
        int criticalSkillsMissing = 0;

        for (JobSkill jobSkill : jobSkills) {
            if (jobSkill.getSkill() == null || jobSkill.getSkill().getId() == null) {
                continue;
            }

            // Algorithm for the match score calculation
            // match score depends on the importance of the skill

            // Importance cant be 0
            int importance = Math.max(1, jobSkill.getImportanceLevel());
            totalWeight += importance * 5.0;

            Long skillId = jobSkill.getSkill().getId();
            if (employeeSkillMap.containsKey(skillId)) {
                int proficiency = Math.max(0, Math.min(employeeSkillMap.get(skillId), 5));// Cap 5 just in case (will set a limit in frontend)
                earnedScore += proficiency * importance; // importance of the skill * maximum proficiency level
            } else {
                // Track missing critical skills (importance >= 4)
                if (importance >= 4) {
                    criticalSkillsMissing++;
                }
            }
        }

        if (totalWeight == 0.0) {
            return BigDecimal.valueOf(100.00);
        }

        double baseScore = (earnedScore / totalWeight) * 100.0;

        double penalty = criticalSkillsMissing * 15.0; // 15% per critical skill penalty
        double finalScore = Math.max(0, baseScore - penalty);

        return BigDecimal.valueOf(finalScore).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateSalaryScore(Job job, Preference preference) {
        if (preference == null || preference.getMinExpectedSalary() == null) {
            return BigDecimal.valueOf(50.00);
        }

        if (job.getMinSalary() == null) {
            return BigDecimal.valueOf(50.00);
        }

        BigDecimal expectedMin = preference.getMinExpectedSalary();

        // Handle as unvalid
        if (expectedMin.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.valueOf(50.00);
        }

        if (job.getMinSalary().compareTo(expectedMin) >= 0) {
            return BigDecimal.valueOf(100.00);
        }

        // Partial score if close
        BigDecimal ratio = job.getMinSalary()
                .divide(expectedMin, 4, RoundingMode.HALF_UP) // 4 for precision
                .multiply(BigDecimal.valueOf(100));

        // 0<=return<=100
        return ratio.max(BigDecimal.ZERO).min(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateLocationScore(Job job, Preference preference) {
        if (preference == null || preference.getPreferredLocations() == null
                || preference.getPreferredLocations().isEmpty()) {
            return BigDecimal.valueOf(50.00);
        }

        String jobLocation = job.getLocation().trim().toLowerCase();

        // for remote
        if (jobLocation.contains("remote") && preference.getPreferredLocations().stream()
                .anyMatch(location -> location.trim().toLowerCase().contains("remote"))) {
            return BigDecimal.valueOf(100.00);
        }

        boolean match = preference.getPreferredLocations().stream()
                .filter(location -> location != null && !location.isBlank())
                .map(v -> v.trim().toLowerCase())
                .anyMatch(prefLocation ->
                        jobLocation.contains(prefLocation) || prefLocation.contains(jobLocation)
                );

        if (match) {
            return BigDecimal.valueOf(100.00);
        }

        if (Boolean.TRUE.equals(preference.getWillingToRelocate())) {
            return BigDecimal.valueOf(70.00);
        }

        return BigDecimal.ZERO;
    }

    private BigDecimal calculateTitleScore(Job job, Preference preference) {
        if (preference == null || preference.getDesiredJobTitles() == null
                || preference.getDesiredJobTitles().isEmpty()) {
            return BigDecimal.valueOf(50.00);
        }

        String jobTitle = job.getTitle().trim().toLowerCase();

        for (String desiredTitle : preference.getDesiredJobTitles()) {
            if (desiredTitle == null || desiredTitle.isBlank()) {
                continue;
            }

            String normalizedDesiredTitle = desiredTitle.trim().toLowerCase();

            // Exact match
            if (jobTitle.equals(normalizedDesiredTitle)) {
                return BigDecimal.valueOf(100.00);
            }

            // Contains
            if (jobTitle.contains(normalizedDesiredTitle) || normalizedDesiredTitle.contains(jobTitle)) {
                return BigDecimal.valueOf(100.00);
            }

            // Partial match
            String[] jobWords = jobTitle.split("\\s+");
            String[] desiredWords = normalizedDesiredTitle.split("\\s+");

            long matchingWords = Arrays.stream(jobWords)
                    .filter(word -> Arrays.asList(desiredWords).contains(word))
                    .count();

            if (matchingWords >= 2) { // At least 2 words match
                return BigDecimal.valueOf(80.00);
            }
        }

        return BigDecimal.ZERO;
    }

    private BigDecimal calculateJobTypeScore(Job job, Preference preference) {
        if (preference == null || preference.getJobTypes() == null || preference.getJobTypes().isEmpty()) {
            return BigDecimal.valueOf(50.00);
        }

        if (job.getJobType() == null) {
            return BigDecimal.valueOf(50.00);
        }

        String jobType = (job.getJobType().name()).trim().toLowerCase();

        boolean match = preference.getJobTypes().stream()
                .filter(type -> type != null && !type.isBlank())
                .map(v -> v.trim().toLowerCase())
                .anyMatch(type -> type.equals(jobType));

        if (match){
            return BigDecimal.valueOf(100.00);
        }
        else{
            return BigDecimal.ZERO;
        }
    }




}
