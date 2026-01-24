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
@Table(name = "employees")

public class Employee {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "employees_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    // Should be a url
    private String cv;

    @Column(columnDefinition = "TEXT")
    private String bio;
}
