package org.example.jobboard.repo;

import org.example.jobboard.model.Institution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstitutionRepo extends JpaRepository<Institution, Long> {
    List<Institution> findTop10ByNameContainingIgnoreCaseOrderByName(String institutionName);
}
