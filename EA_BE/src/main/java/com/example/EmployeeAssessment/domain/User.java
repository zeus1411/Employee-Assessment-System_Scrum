package com.example.EmployeeAssessment.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = true)
    private Role role;

    @OneToOne
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Assessment> assessments;

    // Add self-referencing ManyToOne for manager
    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = true)
    private User manager;

    // Optionally, add OneToMany to track subordinates
    @OneToMany(mappedBy = "manager")
    @JsonIgnore
    private List<User> subordinates;
}
