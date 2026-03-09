package org.example.jobboard.util;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Component
public class FileStorageUtil {
    private static final String UPLOAD_DIR = "uploads";
    private static final Set<String> EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".pdf", ".docx");

    private final Path storageRoot;

    public FileStorageUtil() throws IOException {
        this.storageRoot = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        Files.createDirectories(this.storageRoot);
    }

    public String storeFile(MultipartFile file, Long userId, String documentType) throws IOException {
        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Invalid filename");
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store an empty file");
        }

        String extension = extractExtension(originalFilename);

        if (!EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("File type not allowed: " + extension);
        }

        String uniqueFilename = String.format("%d_%s_%s%s", userId, documentType, UUID.randomUUID(),
                extension);

        Path target = this.storageRoot.resolve(uniqueFilename).normalize();

        // Guard against path traversal
        if (!target.startsWith(this.storageRoot)) {
            throw new SecurityException("Resolved path is outside the upload directory");
        }

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return "/" + UPLOAD_DIR + "/" + uniqueFilename;
    }

    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = this.storageRoot.resolve(filename).normalize();

            if (!filePath.startsWith(this.storageRoot)) {
                throw new SecurityException("Resolved path is outside the upload directory");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            throw new RuntimeException("File not found or unreadable: " + filename);

        } catch (MalformedURLException e) {
            throw new RuntimeException("Malformed file path: " + filename, e);
        }
    }

    public boolean deleteFile(String storedPath) throws IOException {
        String filename = Paths.get(storedPath).getFileName().toString();
        Path target = this.storageRoot.resolve(filename).normalize();

        if (!target.startsWith(this.storageRoot)) {
            throw new SecurityException("Resolved path is outside the upload directory");
        }

        return Files.deleteIfExists(target);
    }


    // helper
    // find file extension
    private String extractExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot) : "";
        // ignore start with .
    }
}
