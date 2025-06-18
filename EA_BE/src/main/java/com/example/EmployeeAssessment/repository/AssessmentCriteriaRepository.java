package com.example.EmployeeAssessment.repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.EmployeeAssessment.domain.AssessmentCriteria;
@Repository
public interface AssessmentCriteriaRepository extends JpaRepository<AssessmentCriteria, Long>,
                JpaSpecificationExecutor<AssessmentCriteria> {
    // You can add custom query methods here if needed
}

