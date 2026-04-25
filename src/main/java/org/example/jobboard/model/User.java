package org.example.jobboard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "full_name", nullable = false, length = 50)
    private String fullName;

    @Email(message = "Email has to be valid")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Dont let user login until admin approve
    @Column(name = "is_active")
    private boolean isActive = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // for inactive user
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "warning_email_sent")
    private Boolean warningEmailSent = false;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_website")
    private String companyWebsite;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    // Should be an url or employee cv
    private String cv;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 20)
    private String phone;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(columnDefinition = "TEXT")
    private String address;


    // might calculate percentage
    @Column(name = "profile_complete")
    private Boolean profileComplete = false;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Experience> experiences = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Education> education = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Certificate> certificates = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Document> documents = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Preference jobPreferences;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_skills",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();


    // get latest cv
    public Document getCurrentCv(){
        if (documents == null || documents.isEmpty()){
            return null;
        }
        return documents.stream().filter(doc -> doc.getDocumentType() == Document.DocumentType.CV)
                .max((doc1, doc2) -> doc1.getUploadedAt().compareTo(doc2.getUploadedAt()))
                .orElse(null); // null if no cv
    }

    // get latest cover letter
    public Document getCurrentCoverLetter(){
        if (documents == null || documents.isEmpty()){
            return null;
        }
        return documents.stream().filter(doc -> doc.getDocumentType() == Document.DocumentType.COVER_LETTER)
                .max((doc1, doc2) -> doc1.getUploadedAt().compareTo(doc2.getUploadedAt()))
                .orElse(null); // null if no cover letter
    }

    // check if user has cv
    public boolean hasCv(){
        if (documents == null || documents.isEmpty()){
            return false;
        }
        return documents.stream().anyMatch(doc -> doc.getDocumentType() == Document.DocumentType.CV);
    }


    // Revise
    // add to match Userdetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return this.isActive;
    }


    public enum Role{
        EMPLOYEE,
        ADMIN,
        EMPLOYER
    }

}
