package org.example.jobboard.repo;

import org.example.jobboard.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepo extends JpaRepository<Document, Long> {
    List<Document> findByUserId(Long userId);
    Optional<Document> findByIdAndUserId(Long documentId, Long userId);
    boolean existsByUserIdAndDocumentType(Long userId, Document.DocumentType documentType);
}
