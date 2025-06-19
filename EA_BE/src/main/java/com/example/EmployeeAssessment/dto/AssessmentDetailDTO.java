package com.example.EmployeeAssessment.dto;

import java.time.Instant;
import java.util.List;
import lombok.Data;

@Data
public class AssessmentDetailDTO {
    private long assessmentId;
    private int score;
    private String feedback;
    private Instant startDate;
    private Instant endDate;
    private String userName;
    private List<CriteriaDTO> criteria;

    @Data
    public static class CriteriaDTO {
        private long assessmentCriteriaId;
        private String criteriaName;
        private String description;
    }
} 