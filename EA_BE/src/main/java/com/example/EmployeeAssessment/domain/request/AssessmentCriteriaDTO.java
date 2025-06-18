package com.example.EmployeeAssessment.domain.request;

import lombok.Data;

@Data
public class AssessmentCriteriaDTO {
    private long assessmentCriteriaId;
    private String criteriaName;
    private int score;
    private String feedback;
}
