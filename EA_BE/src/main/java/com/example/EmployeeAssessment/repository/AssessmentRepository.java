package com.example.EmployeeAssessment.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.EmployeeAssessment.domain.Assessment;
import com.example.EmployeeAssessment.domain.AssessmentCriteria;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    @Query("SELECT ac FROM AssessmentCriteria ac WHERE ac.assessmentCriteriaId IN :ids")
    List<AssessmentCriteria> findAssessmentCriteriaByIdIn(Set<Long> ids);
}
