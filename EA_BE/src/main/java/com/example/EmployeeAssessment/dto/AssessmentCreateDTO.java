package com.example.EmployeeAssessment.dto;

import java.time.Instant;
import java.util.List;
import lombok.Data;

@Data
public class AssessmentCreateDTO {
    private Long userId;
    private Long supervisorId;  // ID of the supervisor creating the assessment
    private Instant startDate;
    private Instant endDate;
    private List<Long> criteriaIds;
    private int score;
    private String feedback;
}
