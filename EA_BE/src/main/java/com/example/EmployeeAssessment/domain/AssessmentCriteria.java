package com.example.EmployeeAssessment.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "assessment_criteria")
@Getter
@Setter
public class AssessmentCriteria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long assessmentCriteriaId;
    private String criteriaName;
    private String description;
}
