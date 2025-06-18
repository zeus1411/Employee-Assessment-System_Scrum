package com.example.EmployeeAssessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.EmployeeAssessment.domain.AssessmentCriteria;

@Repository
public interface AssessmentCriteriaRepository extends JpaRepository<AssessmentCriteria, Long>,
        JpaSpecificationExecutor<AssessmentCriteria> {

<<<<<<< HEAD
}
=======
}
>>>>>>> a959392aeb01b617b1007baf6109415bce2f9cb4
