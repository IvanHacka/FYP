package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EducationRequest;
import org.example.jobboard.dto.EducationResponse;
import org.example.jobboard.model.Education;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.EducationRepo;
import org.example.jobboard.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {
    private final EducationRepo educationRepo;
    private final UserRepo userRepo;

    public List<EducationResponse> getMyEducation(Long userId) {
        return educationRepo.findByUserIdOrderByStartDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public EducationResponse addEducation(Long userId, EducationRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("Only employees can add education");
        }

        Education education = Education.builder()
                .user(user)
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .startDate(request.getStartDate())
                .graduationDate(request.getEndDate())
                .description(request.getDescription())
                .build();

        Education saved = educationRepo.save(education);
        return mapToResponse(saved);
    }

    public EducationResponse updateEducation(Long userId, Long educationId, EducationRequest request) {
        Education education = educationRepo.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education record not found"));

        if (!education.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartDate(request.getStartDate());
        education.setGraduationDate(request.getEndDate());
        education.setDescription(request.getDescription());

        Education saved = educationRepo.save(education);
        return mapToResponse(saved);
    }

    public void deleteEducation(Long userId, Long educationId) {
        Education education = educationRepo.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education record not found"));

        if (!education.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        educationRepo.delete(education);
    }

    private EducationResponse mapToResponse(Education education) {
        return EducationResponse.builder()
                .educationId(education.getId())
                .institution(education.getInstitution())
                .degree(education.getDegree())
                .fieldOfStudy(education.getFieldOfStudy())
                .startDate(education.getStartDate())
                .endDate(education.getGraduationDate())
                .description(education.getDescription())
                .build();
    }
}
