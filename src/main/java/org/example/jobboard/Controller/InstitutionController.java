package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.dto.InstitutionResponse;
import org.example.jobboard.service.InstitutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/institutions")
@RequiredArgsConstructor
public class InstitutionController {
    private final InstitutionService institutionService;

    @GetMapping("/search")
    public ResponseEntity<List<InstitutionResponse>> searchInstitution(@RequestParam String institution) {
        return ResponseEntity.ok(institutionService.searchInstitutions(institution));
    }
}
