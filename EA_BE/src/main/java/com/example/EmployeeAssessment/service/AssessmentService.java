package com.example.EmployeeAssessment.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.EmployeeAssessment.domain.Assessment;
import com.example.EmployeeAssessment.domain.AssessmentCriteria;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.dto.AssessmentCreateDTO;
import com.example.EmployeeAssessment.repository.AssessmentCriteriaRepository;
import com.example.EmployeeAssessment.repository.AssessmentRepository;
import com.example.EmployeeAssessment.repository.UserRepository;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssessmentCriteriaRepository assessmentCriteriaRepository;

    @Transactional
    public Assessment createAssessment(AssessmentCreateDTO dto) {
        // Validate user exists
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate assessment period
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        // Validate criteria exist
        List<AssessmentCriteria> criteriaList = assessmentCriteriaRepository
                .findAllById(dto.getCriteriaIds());
        if (criteriaList.size() != dto.getCriteriaIds().size()) {
            throw new RuntimeException("Some assessment criteria not found");
        }

        // Create assessment
        Assessment assessment = new Assessment();
        assessment.setUser(user);
        assessment.setStartDate(dto.getStartDate());
        assessment.setEndDate(dto.getEndDate());
        assessment.setScore(dto.getScore());
        assessment.setFeedback(dto.getFeedback());
        assessment.setAssessmentCriteria(criteriaList);

        return assessmentRepository.save(assessment);
    }
}
