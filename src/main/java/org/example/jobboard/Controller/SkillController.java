package org.example.jobboard.Controller;


import lombok.RequiredArgsConstructor;
import org.example.jobboard.model.Skill;
import org.example.jobboard.repo.SkillRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillRepo skillRepo;

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillRepo.findAll();
        return ResponseEntity.ok(skills);
    }


    // search skills by name
    @GetMapping("/search")
    public ResponseEntity<List<Skill>> searchSkills(@RequestParam String name) {
        List<Skill> skills = skillRepo.findBySkillNameContainingIgnoreCase(name);
        return ResponseEntity.ok(skills);
    }
}
