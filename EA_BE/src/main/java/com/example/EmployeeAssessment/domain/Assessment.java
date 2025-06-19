package com.example.EmployeeAssessment.domain;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "assessments")
@Data
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long assessmentId;
    private int score;
    private String feedback;
    private Instant startDate;
    private Instant endDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany
    @JsonIgnore
    @JoinTable(name = "assessment_criteria_mapping", // Tên bảng liên kết
            joinColumns = @JoinColumn(name = "assessment_id"), // Cột liên kết với Assessment
            inverseJoinColumns = @JoinColumn(name = "assessment_criteria_id") // Cột liên kết với AssessmentCriteria
    )
    private List<AssessmentCriteria> assessmentCriteria;

    @Column(name = "created_by")
    private Long createdBy;
}