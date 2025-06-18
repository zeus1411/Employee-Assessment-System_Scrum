package com.example.EmployeeAssessment.domain.request;

import java.time.Instant;
import java.util.List;
import lombok.Data;

@Data
public class CreateAssessmentDTO {
    private long employeeId;
    private Instant startDate;
    private Instant endDate;
    private List<AssessmentCriteriaDTO> assessmentCriteria;
    private String comments;
}
