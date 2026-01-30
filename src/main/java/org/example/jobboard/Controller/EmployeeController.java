package org.example.jobboard.Controller;


import org.example.jobboard.util.FileStorageUtil;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployeeProfileRequest;
import org.example.jobboard.model.Employee;
import org.example.jobboard.service.EmployeeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController

@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final FileStorageUtil fileStorageUtil;
    // POST
    // api/employees/profile
    @PostMapping("/profile")
    ResponseEntity<Employee> createProfile(@RequestBody EmployeeProfileRequest employeeProfileRequest) {
        return ResponseEntity.ok(employeeService.createProfile(employeeProfileRequest));
    }

    // POST
    // api/employees/{id}/cv
    @PostMapping("/{id}/cv")
    public ResponseEntity<Employee> updateProfile(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(employeeService.cvUpload(id, file));
    }

    @GetMapping("/cv/{fileName}")
    public ResponseEntity<Resource> downloadCv(@PathVariable String fileName) {
        // Load file
        Resource resource = fileStorageUtil.loadFileAsResource(fileName);
        String contentType = "application/octet-stream"; // to binary?

        // download
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

}
