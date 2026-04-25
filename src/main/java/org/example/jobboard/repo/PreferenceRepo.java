package org.example.jobboard.repo;

import org.example.jobboard.model.Preference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenceRepo extends JpaRepository<Preference, Long> {
    Optional<Preference> findByUserId(Long userId);
}
