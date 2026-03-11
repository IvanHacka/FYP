package org.example.jobboard.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "employeeSkills")
public class EmployeeSkill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"skills", "experiences", "documents", "education", "certificates", "jobPreferences", "password", "authorities"})
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    // 1 = Beginner, 2 = Intermediate, 3 = advanced, 4 = expert
    @Column(name = "proficiency_level")
    private Integer proficiencyLevel;


    // might need this for AI matching
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience = 0;
}
