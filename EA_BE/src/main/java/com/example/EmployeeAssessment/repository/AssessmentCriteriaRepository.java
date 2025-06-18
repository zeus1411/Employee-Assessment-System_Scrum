package com.example.EmployeeAssessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.EmployeeAssessment.domain.AssessmentCriteria;

@Repository
public interface AssessmentCriteriaRepository extends JpaRepository<AssessmentCriteria, Long>,
        JpaSpecificationExecutor<AssessmentCriteria> {
    boolean existsByCriteriaName(String criteriaName);

}