package com.example.EmployeeAssessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.EmployeeAssessment.domain.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    // Custom query methods can be added here if needed
}
