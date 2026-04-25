package org.example.jobboard.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.Institution;
import org.example.jobboard.repo.InstitutionRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;


@Component
@RequiredArgsConstructor
public class InstitutionDataLoader implements CommandLineRunner {
    private final InstitutionRepo institutionRepo;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (institutionRepo.count() > 0) {
            return;
        }

        InputStream inputStream = getClass()
                .getResourceAsStream("/static/world_universities_and_domains.json");

        if (inputStream == null) {
            throw new RuntimeException("Institution JSON file not found");
        }

        List<Map<String, Object>> universities = objectMapper.readValue(
                inputStream,
                new TypeReference<List<Map<String, Object>>>() {
                }
        );

        List<Institution> institutions = universities.stream()
                .map(item -> {

                    return Institution.builder()
                            .name((String) item.get("name"))
                            .country((String) item.get("country"))
                            .build();
                })
                .toList();

        institutionRepo.saveAll(institutions);
    }

}
