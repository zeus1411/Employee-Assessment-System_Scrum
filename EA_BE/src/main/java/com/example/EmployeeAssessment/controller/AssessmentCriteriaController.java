package com.example.EmployeeAssessment.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import com.example.EmployeeAssessment.domain.AssessmentCriteria;
<<<<<<< HEAD
import com.example.EmployeeAssessment.domain.response.ResultPaginationDTO;
=======
import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
>>>>>>> a959392aeb01b617b1007baf6109415bce2f9cb4
import com.example.EmployeeAssessment.service.AssessmentCriteriaService;

@RestController
@RequestMapping("/api/v1")
public class AssessmentCriteriaController {
    private final AssessmentCriteriaService assessmentCriteriaService;

    public AssessmentCriteriaController(AssessmentCriteriaService assessmentCriteriaService) {
        this.assessmentCriteriaService = assessmentCriteriaService;
    }

    @PostMapping("/assessment-criteria")
    public ResponseEntity<AssessmentCriteria> createAssessmentCriteria(
            @RequestBody AssessmentCriteria assessmentCriteria) {
        AssessmentCriteria createdCriteria = assessmentCriteriaService.save(assessmentCriteria);
        return ResponseEntity.ok().body(createdCriteria);
    }

    @GetMapping("/assessment-criteria")
    // @ApiMessage("Fetch assessment-criteria")
<<<<<<< HEAD
    public ResponseEntity<ResultPaginationDTO> getAssessmentCriteria(
=======
    public ResponseEntity<ResultPaginationDTO> getCompany(
>>>>>>> a959392aeb01b617b1007baf6109415bce2f9cb4
            @Filter Specification<AssessmentCriteria> spec, Pageable pageable) {

        return ResponseEntity.ok(this.assessmentCriteriaService
                .handleGetAssessmentCriteria(spec, pageable));
    }

    @PutMapping("/assessment-criteria")
    public ResponseEntity<AssessmentCriteria> updateAssessmentCriteria(
            @RequestBody AssessmentCriteria assessmentCriteria) {
        AssessmentCriteria updatedCriteria = assessmentCriteriaService.updateAssessmentCriteria(assessmentCriteria);
        return ResponseEntity.ok().body(updatedCriteria);
    }

    @DeleteMapping("/assessment-criteria/{id}")
    public ResponseEntity<String> deleteAssessmentCriteria(@PathVariable("id") long assessmentCriteriaId) {
        this.assessmentCriteriaService.deleteAssessmentCriteria(assessmentCriteriaId);
        return ResponseEntity.ok()
                .body("Assessment Criteria with ID " + assessmentCriteriaId + " deleted successfully.");
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> a959392aeb01b617b1007baf6109415bce2f9cb4
