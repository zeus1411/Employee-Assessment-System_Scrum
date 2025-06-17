package com.example.EmployeeAssessment.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
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

    @OneToOne(mappedBy = "user")
    private Assessment assessment;
}
