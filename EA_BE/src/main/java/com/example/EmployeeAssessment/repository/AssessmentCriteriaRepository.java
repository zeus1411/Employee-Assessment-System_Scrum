package com.example.EmployeeAssessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.EmployeeAssessment.domain.AssessmentCriteria;

public interface AssessmentCriteriaRepository extends JpaRepository<AssessmentCriteria, Long> {
    // You can add custom query methods here if needed
}
