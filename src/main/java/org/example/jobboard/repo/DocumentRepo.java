package org.example.jobboard.repo;

import org.example.jobboard.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepo extends JpaRepository<Document, Long> {
    List<Document> findByUserId(Long userId);
    boolean existsByUserIdAndDocumentType(Long userId, Document.DocumentType documentType);
}
