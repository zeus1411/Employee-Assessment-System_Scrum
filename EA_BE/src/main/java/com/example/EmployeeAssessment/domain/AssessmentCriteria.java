package com.example.EmployeeAssessment.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "assessment_criteria")
@Data
public class AssessmentCriteria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long assessmentCriteriaId;
    private String criteriaName;
    private String description;

    @ManyToMany(mappedBy = "assessmentCriteria")
    @JsonIgnore
    private List<Assessment> assessments; // Sửa tên biến thành số nhiều để rõ ràng hơn
}