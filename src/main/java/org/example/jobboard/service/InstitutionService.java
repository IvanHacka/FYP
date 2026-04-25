package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.InstitutionResponse;
import org.example.jobboard.repo.InstitutionRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstitutionService {
    private final InstitutionRepo institutionRepo;

    public List<InstitutionResponse> searchInstitutions(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }

        return institutionRepo.findTop10ByNameContainingIgnoreCaseOrderByName(query.trim())
                .stream()
                .map(institution -> InstitutionResponse.builder()
                        .id(institution.getId())
                        .name(institution.getName())
                        .country(institution.getCountry())
                        .build()
                )
                .toList();
    }

}
