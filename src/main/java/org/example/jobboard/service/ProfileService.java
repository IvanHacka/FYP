package org.example.jobboard.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.ExperienceRequest;
import org.example.jobboard.model.Experience;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EmployeeSkillRepo;
import org.example.jobboard.repo.ExperienceRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepo userRepo;
    private final ExperienceRepo experienceRepo;
    private final EmployeeSkillRepo employeeSkillRepo;

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
    public int profileCompletion(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        int score = 0;

        if(user.getFullName() != null && !user.getFullName().isEmpty()) {
            score += 10;
        }
        if(user.getBio() != null && !user.getBio().isEmpty()) {
            score += 10;
        }
        if(user.getPhone() != null && !user.getPhone().isEmpty()) {
            score += 10;
        }
        if(user.getAddress() != null && !user.getAddress().isEmpty()) {
            score += 10;
        }

        Long count = employeeSkillRepo.countByUserId(userId);
        if(count >= 5) {
            score += 20;
        }
        else{
            score += (int)(count * 4);
        }

        if(user.hasCv()){
            score += 20;
        }

        if(!user.getExperiences().isEmpty()){
            score += 10;
        }
        if(!user.getEducation().isEmpty()){
            score += 10;
        }

        return score;
    }
}