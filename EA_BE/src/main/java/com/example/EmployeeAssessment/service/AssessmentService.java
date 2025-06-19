package com.example.EmployeeAssessment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.EmployeeAssessment.domain.Assessment;
import com.example.EmployeeAssessment.domain.AssessmentCriteria;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.dto.AdminAssessmentDTO;
import com.example.EmployeeAssessment.dto.AssessmentCreateDTO;
import com.example.EmployeeAssessment.dto.AssessmentResponseDTO;
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

        // Validate supervisor exists
        User supervisor = userRepository.findById(dto.getSupervisorId())
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        // Create assessment
        Assessment assessment = new Assessment();
        assessment.setUser(user);
        assessment.setStartDate(dto.getStartDate());
        assessment.setEndDate(dto.getEndDate());
        assessment.setScore(dto.getScore());
        assessment.setFeedback(dto.getFeedback());
        assessment.setAssessmentCriteria(criteriaList);
        assessment.setCreatedBy(supervisor.getUserId()); // Set the creator (supervisor)

        return assessmentRepository.save(assessment);
    }
    
    /**
     * Get all assessments (for ADMIN role)
     */
    @Transactional(readOnly = true)
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }
    
    /**
     * Get assessments created by a specific supervisor
     * @param supervisorId The ID of the supervisor
     */
    // For Admin: Get all assessments with employee names and criteria
    @Transactional(readOnly = true)
    public List<AdminAssessmentDTO> getAllAssessmentsForAdmin() {
        List<Assessment> assessments = assessmentRepository.findAll();
        return assessments.stream()
                .map(this::convertToAdminDto)
                .collect(Collectors.toList());
    }
    
    // For Supervisor: Get assessments created by specific supervisor (admin view format)
    @Transactional(readOnly = true)
    public List<AdminAssessmentDTO> getSupervisorAssessmentsForAdminView(Long supervisorId) {
        List<Assessment> assessments = assessmentRepository.findByCreatedBy(supervisorId);
        return assessments.stream()
                .map(this::convertToAdminDto)
                .collect(Collectors.toList());
    }
    
    // Keep the old method for backward compatibility
    @Deprecated
    @Transactional(readOnly = true)
    public List<AssessmentResponseDTO> getAssessmentsBySupervisor(Long supervisorId) {
        List<Assessment> assessments = assessmentRepository.findByCreatedBy(supervisorId);
        return assessments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Convert to Admin DTO (simplified view)
    private AdminAssessmentDTO convertToAdminDto(Assessment assessment) {
        AdminAssessmentDTO dto = new AdminAssessmentDTO();
        dto.setEmployeeName(assessment.getUser().getUserName());
        dto.setCriteriaNames(assessment.getAssessmentCriteria().stream()
                .map(AssessmentCriteria::getCriteriaName)
                .collect(Collectors.toList()));
        return dto;
    }
    
    // Convert to Response DTO (detailed view)
    public AssessmentResponseDTO convertToDto(Assessment assessment) {
        AssessmentResponseDTO dto = new AssessmentResponseDTO();
        dto.setId(assessment.getAssessmentId());
        dto.setUserId(assessment.getUser().getUserId());
        dto.setUserName(assessment.getUser().getEmail());
        
        // Get supervisor info
        if (assessment.getCreatedBy() != null) {
            userRepository.findById(assessment.getCreatedBy()).ifPresent(supervisor -> {
                dto.setSupervisorId(supervisor.getUserId());
                dto.setSupervisorName(supervisor.getUserName());
            });
        }
        
        // Convert dates
        if (assessment.getStartDate() != null) {
            dto.setStartDate(assessment.getStartDate().atZone(java.time.ZoneId.systemDefault()).toLocalDate());
        }
        if (assessment.getEndDate() != null) {
            dto.setEndDate(assessment.getEndDate().atZone(java.time.ZoneId.systemDefault()).toLocalDate());
        }
        
        // Set score and feedback
        dto.setScore((double) assessment.getScore());
        dto.setFeedback(assessment.getFeedback());
        dto.setCriteriaList(assessment.getAssessmentCriteria());
        return dto;
    }
}
