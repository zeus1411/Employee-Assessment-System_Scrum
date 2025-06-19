package com.example.EmployeeAssessment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.EmployeeAssessment.domain.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    // Find all assessments created by a specific user
    List<Assessment> findByCreatedBy(Long createdBy);
}
