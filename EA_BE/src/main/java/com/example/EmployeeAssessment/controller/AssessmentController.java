package com.example.EmployeeAssessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EmployeeAssessment.domain.Assessment;
import com.example.EmployeeAssessment.domain.request.CreateAssessmentDTO;
import com.example.EmployeeAssessment.service.AssessmentService;

@RestController
@RequestMapping("/api/v1")
public class AssessmentController {
    
    @Autowired
    private AssessmentService assessmentService;
    
    @PostMapping("/assesments")
    public ResponseEntity<Assessment> createAssessment(@RequestBody CreateAssessmentDTO assessmentDTO) {
        // Get current user ID from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // You would need to implement a method to get userId from username
        long supervisorId = getUserIdFromUsername(username);
        
        Assessment assessment = assessmentService.createAssessment(supervisorId, assessmentDTO);
        return ResponseEntity.ok(assessment);
    }
    
    private long getUserIdFromUsername(String username) {
        // Implement this method based on your user authentication system
        // This is a placeholder - you need to implement the actual logic
        return 1L; // Replace with actual implementation
    }
}
