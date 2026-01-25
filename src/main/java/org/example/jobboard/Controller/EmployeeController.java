package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.EmployeeProfileRequest;
import org.example.jobboard.model.Employee;
import org.example.jobboard.repo.EmployeeRepo;
import org.example.jobboard.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    // POST
    // api/employee/profile
    @PostMapping("/profile")
    ResponseEntity<Employee> createProfile(@RequestBody EmployeeProfileRequest employeeProfileRequest) {
        return ResponseEntity.ok(employeeService.createProfile(employeeProfileRequest));
    }

}
