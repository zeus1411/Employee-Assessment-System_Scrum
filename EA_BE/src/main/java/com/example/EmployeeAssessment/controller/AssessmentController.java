package com.example.EmployeeAssessment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.dto.AdminAssessmentDTO;
import com.example.EmployeeAssessment.dto.AssessmentCreateDTO;
import com.example.EmployeeAssessment.dto.AssessmentResponseDTO;
import com.example.EmployeeAssessment.repository.UserRepository;
import com.example.EmployeeAssessment.service.AssessmentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AssessmentController {

    @Autowired
    private final AssessmentService assessmentService;
    
    @Autowired
    private final UserRepository userRepository;

    @PostMapping("/assessments")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<AssessmentResponseDTO> createAssessment(
            @RequestBody AssessmentCreateDTO dto,
            Authentication authentication) {
        // Get current supervisor from authentication
        String email = authentication.getName();
        User supervisor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        
        // Set the supervisor ID who is creating this assessment
        dto.setSupervisorId(supervisor.getUserId());
        
        var assessment = assessmentService.createAssessment(dto);
        return ResponseEntity.ok(assessmentService.convertToDto(assessment));
    }
    
    /**
     * Admin endpoint: Get all assessments with employee names and criteria
     */
    @GetMapping("/admin/assessments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminAssessmentDTO>> getAllAssessmentsForAdmin() {
        return ResponseEntity.ok(assessmentService.getAllAssessmentsForAdmin());
    }
    
    /**
     * Supervisor endpoint: Get all assessments created by the current supervisor
     * Returns only employee name and assessment criteria (same as admin view)
     */
    @GetMapping("/supervisor/assessments")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<List<AdminAssessmentDTO>> getSupervisorAssessments(
            Authentication authentication) {
        // Get current supervisor from authentication
        String email = authentication.getName();
        User supervisor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        
        return ResponseEntity.ok(assessmentService.getSupervisorAssessmentsForAdminView(supervisor.getUserId()));
    }
}
