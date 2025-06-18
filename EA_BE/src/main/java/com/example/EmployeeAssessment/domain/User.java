package com.example.EmployeeAssessment.domain;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
<<<<<<< HEAD
import jakarta.persistence.Column;
=======
>>>>>>> eab59e0f882256de36d08a6814f560e9fde1f609
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;
    private String userName;
    private String password;
    private String email;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = true)
    private Role role;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Assessment> assessments;

    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = true)
    private User manager;

    @OneToMany(mappedBy = "manager")
    @JsonIgnore
    private List<User> subordinates;

    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private List<Team> teams;

    @OneToMany(mappedBy = "supervisor")
    @JsonIgnore
    private List<Team> supervisedTeams; // Thêm mối quan hệ ngược
}