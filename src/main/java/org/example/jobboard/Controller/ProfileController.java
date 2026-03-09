package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.ExperienceRequest;
import org.example.jobboard.model.*;
import org.example.jobboard.repo.DocumentRepo;
import org.example.jobboard.service.ProfileService;
import org.example.jobboard.service.UserService;
import org.example.jobboard.util.FileStorageUtil;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.plaf.SeparatorUI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;
    private final FileStorageUtil fileStorageUtil;
    private final DocumentRepo documentRepo;

    // All experience for current user
    // GET api/profile/experiences
    @GetMapping("/experiences")
    public ResponseEntity<List<Experience>> getExperiences(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<Experience> experiences = profileService.getUserExperiences(user.getId());
        return ResponseEntity.ok(experiences);
    }

    // Add experience
    // POST api/profile/experiences
    @PostMapping("/experiences")
    public ResponseEntity<Experience> addExperience(@RequestBody ExperienceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        Experience experience = profileService.addExperience(request, user.getId());
        return ResponseEntity.ok(experience);
    }

    // Update experience
    // PUT api/profile/experiences/{id}
    @PutMapping("/experiences/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id,
            @RequestBody ExperienceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        Experience experience = profileService.updateExperience(request, user.getId(), id);
        return ResponseEntity.ok(experience);
    }

    // Delete experience
    // DELETE api/profile/experiences
    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<String> deleteExperience(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        profileService.deleteExperience(user.getId(), id);
        return ResponseEntity.ok("Experience deleted successfully");
    }

    // -----Document
    // Get every documents
    // GET api/profile/documents
    @GetMapping("/documents")
    public ResponseEntity<List<Document>> getDocuments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<Document> documents = documentRepo.findByUserId(user.getId());
        return ResponseEntity.ok(documents);
    }

    // Upload document
    // POST api/profile/documents
    @PostMapping("/documents")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file,
                                            @RequestParam("documentType") String documentType,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file");
        }

        // See if correct file type
        try{
            // return IllegalArgument
            // return NullPointer
            Document.DocumentType.valueOf(documentType);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body("Invalid documentType");
        }

        try{
            String filePath = fileStorageUtil.storeFile(file, user.getId(), documentType);

            Document document = Document.builder()
                    .user(user)
                    .documentType(Document.DocumentType.valueOf(documentType))
                    .documentName(file.getOriginalFilename())
                    .filePath(filePath)
                    .fileSize(file.getSize())
                    .uploadedAt(LocalDateTime.now())
                    .build();

            Document saved = documentRepo.save(document);
            return ResponseEntity.ok(saved);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body("Fail to upload file");
        }
    }

    // Download file
    // GET /api/profile/documents/download/{documentId}
    @GetMapping("/documents/download/{documentId}")
    public ResponseEntity<Resource> downloadDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long documentId) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Document document = documentRepo.findById(documentId).orElseThrow(() ->
                new RuntimeException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = fileStorageUtil.loadFileAsResource(document.getFilePath());
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
                // two possible value: inline or attachment
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""
                        + document.getDocumentName() + "\"")
                .body(resource);

    }

    // Delete file
    // DELETE /api/profile/documents/{documentId}
    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<String> deleteDocument(@AuthenticationPrincipal UserDetails userDetails,
                                                 @PathVariable Long documentId) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Document document = documentRepo.findById(documentId).orElseThrow(() ->
                new RuntimeException("Document not found"));
        if (!document.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        try{
            fileStorageUtil.deleteFile(document.getFilePath());
        }
        catch (Exception e){
            System.err.println("Fail to delete file: " + e.getMessage());
            return ResponseEntity.badRequest().body("Fail to delete file");
        }

        documentRepo.delete(document);
        return ResponseEntity.ok("Document deleted successfully");
    }

    // check if the user uploaded cv on profile
    // GET api/profile/hasCv
    @GetMapping("/hasCv")
    public ResponseEntity<?> hasCv(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        boolean hasCv = documentRepo.existsByUserIdAndDocumentType(user.getId(), Document.DocumentType.CV);
        return ResponseEntity.ok(new HasCvResponse(hasCv));
    }


    // helper
    // return a clearer message (json) instead of hasCv (true/false)

    record HasCvResponse(boolean hasCv) {
    }
}