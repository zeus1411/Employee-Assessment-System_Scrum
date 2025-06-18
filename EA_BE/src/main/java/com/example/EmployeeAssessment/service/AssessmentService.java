package com.example.EmployeeAssessment.service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.EmployeeAssessment.domain.Assessment;
import com.example.EmployeeAssessment.domain.AssessmentCriteria;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.AssessmentCriteriaDTO;
import com.example.EmployeeAssessment.domain.request.CreateAssessmentDTO;
import com.example.EmployeeAssessment.repository.AssessmentRepository;
import com.example.EmployeeAssessment.repository.UserRepository;

@Service
public class AssessmentService {
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public Assessment createAssessment(long supervisorId, CreateAssessmentDTO assessmentDTO) {
        // Get supervisor and employee
        User supervisor = userRepository.findById(supervisorId)
            .orElseThrow(() -> new RuntimeException("Supervisor not found"));
            
        User employee = userRepository.findById(assessmentDTO.getEmployeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found"));
            
        // Check if supervisor is manager of employee
        if (employee.getManager() == null || employee.getManager().getUserId() != supervisorId) {
            throw new RuntimeException("Supervisor is not authorized to assess this employee");
        }
        
        // Create assessment
        Assessment assessment = new Assessment();
        assessment.setUser(employee);
        assessment.setStartDate(assessmentDTO.getStartDate());
        assessment.setEndDate(assessmentDTO.getEndDate());
        assessment.setFeedback(assessmentDTO.getComments());
        
        // Calculate overall score based on criteria
        int totalScore = assessmentDTO.getAssessmentCriteria().stream()
            .mapToInt(criterion -> criterion.getScore())
            .sum();
        assessment.setScore(totalScore);
        
        // Set assessment criteria
        Set<Long> criteriaIds = assessmentDTO.getAssessmentCriteria().stream()
            .map(criterion -> criterion.getAssessmentCriteriaId())
            .collect(Collectors.toSet());
        
        List<AssessmentCriteria> criteriaList = assessmentRepository.findAssessmentCriteriaByIdIn(criteriaIds);
        assessment.setAssessmentCriteria(criteriaList);
        
        return assessmentRepository.save(assessment);
    }
}
