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
@Table(name = "employers")
public class Employer {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "employer_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_website", nullable = false)
    private String companyWebsite;

    @Column(columnDefinition = "TEXT")
    private String description;

}
