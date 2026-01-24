package org.example.jobboard.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "skills")
public class Skill {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "skill_id")
    private Long id;

    @Column(name = "skill_name", nullable = false, unique = true)
    private String skillName;
}
