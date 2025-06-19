package com.example.EmployeeAssessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EmployeeAssessment.dto.AssessmentCreateDTO;
import com.example.EmployeeAssessment.service.AssessmentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AssessmentController {

    @Autowired
    private final AssessmentService assessmentService;

    @PostMapping("/assessments")
    // @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<?> createAssessment(@RequestBody AssessmentCreateDTO dto) {
        var assessment = assessmentService.createAssessment(dto);
        return ResponseEntity.ok(assessment);
    }
}
