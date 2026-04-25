package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployeePreferenceRequest;
import org.example.jobboard.dto.EmployeePreferenceResponse;
import org.example.jobboard.dto.ExperienceRequest;
import org.example.jobboard.dto.ProfileCompletionResponse;
import org.example.jobboard.model.Experience;
import org.example.jobboard.model.Preference;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.ExperienceRepo;
import org.example.jobboard.repo.PreferenceRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepo userRepo;
    private final ExperienceRepo experienceRepo;
    private final EmployeeSkillRepo employeeSkillRepo;
    private final PreferenceRepo preferenceRepo;

    // add new experience
    @Transactional
    public Experience addExperience(ExperienceRequest request, Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Experience experience = Experience.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isCurrent(request.getIsCurrent() != null ? request.getIsCurrent() : false)
                .description(request.getDescription())
                .build();

        return experienceRepo.save(experience);
    }

    @Transactional
    public Experience updateExperience(ExperienceRequest request, Long userId, Long experienceId) {
        Experience experience = experienceRepo.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found"));


        // make sure user can only change if they have the experience
        // (Cant change others experience)
        if (!experience.getUser().getId().equals(userId)) {
            throw new RuntimeException("User not have this experience");
        }

        experience.setCompanyName(request.getCompanyName());
        experience.setJobTitle(request.getJobTitle());
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.getEndDate());
        experience.setIsCurrent(request.getIsCurrent() != null ? request.getIsCurrent() : false);
        experience.setDescription(request.getDescription());
        return experienceRepo.save(experience);
    }

    @Transactional
    public void deleteExperience(Long userId, Long experienceId) {
        Experience experience = experienceRepo.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found"));

        if (!experience.getUser().getId().equals(userId)) {
            throw new RuntimeException("User not have this experience");
        }

        experienceRepo.delete(experience);
    }

    // Get all experience for the user
    // Match findByUserId
    public List<Experience> getUserExperiences(Long userId) {
        return experienceRepo.findByUserIdOrderByStartDateDesc(userId);
    }

//    // Get one experience
//    public Experience getExperience(Long experienceId) {
//        return experienceRepo.findById(experienceId)
//            .orElseThrow(() -> new RuntimeException("Experience not found"));
//    }

    // calculate completion of profile setup
    public ProfileCompletionResponse profileCompletion(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        boolean hasBasicInfo = user.getFullName() != null && !user.getFullName().trim().isEmpty()
                && user.getBio() != null && !user.getBio().trim().isEmpty()
                && user.getPhone() != null && !user.getPhone().trim().isEmpty()
                && user.getAddress() != null && !user.getAddress().trim().isEmpty();

        Long count = employeeSkillRepo.countByUserId(userId);
        long skillCount = count != null ? count : 0L;

        boolean hasExperience = user.getExperiences() != null && !user.getExperiences().isEmpty();
        boolean hasEducation = user.getEducation() != null && !user.getEducation().isEmpty();

        int score = 0;

        if (hasBasicInfo) score += 40;
        score += Math.min((int) skillCount * 4, 20);
        if (user.hasCv()) score += 20;
        if (hasExperience) score += 10;
        if (hasEducation) score += 10;

        return ProfileCompletionResponse.builder()
                .completionScore(Math.min(score, 100))
                .hasBasicInfo(hasBasicInfo)
                .hasSkills(skillCount >= 5)
                .hasCv(user.hasCv())
                .hasExperience(hasExperience)
                .hasEducation(hasEducation)
                .build();
    }

    public EmployeePreferenceResponse getEmployeePreferences(Long userId) {
        Preference preference = preferenceRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Preference not found"));

        if (preference == null) return EmployeePreferenceResponse.builder().build();

        return EmployeePreferenceResponse.builder()
                .desiredJobTitle(preference.getDesiredJobTitles())
                .preferredLocations(preference.getPreferredLocations())
                .minExpectedSalary(preference.getMinExpectedSalary())
                .jobTypes(preference.getJobTypes())
                .willingToRelocate(preference.getWillingToRelocate())
                .availableStartDate(preference.getAvailableStartDate())
                .build();
    }

    public EmployeePreferenceResponse updateEmployeePreferences(
            Long userId,
            EmployeePreferenceRequest request
    ) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("Only employees can update job preferences");
        }

        Preference preference = preferenceRepo.findByUserId(userId)
                    .orElse(Preference.builder().user(user).build());

        preference.setDesiredJobTitles(request.getDesiredJobTitle());
        preference.setPreferredLocations(request.getPreferredLocations());
        preference.setMinExpectedSalary(request.getMinExpectedSalary());
        preference.setJobTypes(request.getJobTypes());
        preference.setAvailableStartDate(request.getAvailableStartDate());
        preference.setWillingToRelocate(request.getWillingToRelocate());

        Preference saved = preferenceRepo.save(preference);

        return EmployeePreferenceResponse.builder()
                .desiredJobTitle(saved.getDesiredJobTitles())
                .preferredLocations(saved.getPreferredLocations())
                .minExpectedSalary(saved.getMinExpectedSalary())
                .jobTypes(saved.getJobTypes())
                .availableStartDate(saved.getAvailableStartDate())
                .willingToRelocate(saved.getWillingToRelocate())
                .build();
    }
}