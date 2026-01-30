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
import java.util.UUID;

@Component
public class FileStorageUtil {
    private final String UPLOAD_DIRECTORY = "upload";

    public String saveFile(MultipartFile file) throws IOException {
        // create a folder if there isnt already one
        Path uploadPath = Paths.get(UPLOAD_DIRECTORY, file.getOriginalFilename());
//        if (!uploadPath.toFile().exists()) {
//            uploadPath.toFile().mkdirs();
//        }
        if(!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        // Prevent overwrite
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), path);
        return fileName; // return a unique file name to save
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = Paths.get(UPLOAD_DIRECTORY).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File not found " + fileName, e);
        }
    }
}
