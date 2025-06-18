package com.example.EmployeeAssessment.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import com.example.EmployeeAssessment.domain.AssessmentCriteria;
import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.request.ReqUpdateUserDTO;
import com.example.EmployeeAssessment.service.AssessmentCriteriaService;
import com.example.EmployeeAssessment.util.annotation.APIMessage;
import com.example.EmployeeAssessment.util.error.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class AssessmentCriteriaController {
    private final AssessmentCriteriaService assessmentCriteriaService;

    public AssessmentCriteriaController(AssessmentCriteriaService assessmentCriteriaService) {
        this.assessmentCriteriaService = assessmentCriteriaService;
    }

    @PostMapping("/assessment-criteria")
    public ResponseEntity<AssessmentCriteria> createAssessmentCriteria(
            @RequestBody AssessmentCriteria assessmentCriteria) throws IdInvalidException {

        boolean exists = this.assessmentCriteriaService.existsByCriteriaName(assessmentCriteria.getCriteriaName());
        if (exists) {
            throw new IdInvalidException(
                    "AssessmentCriteria with name '" + assessmentCriteria.getCriteriaName() + "' already exists.");
        }

        AssessmentCriteria createdCriteria = assessmentCriteriaService.save(assessmentCriteria);
        return ResponseEntity.ok().body(createdCriteria);
    }

    @GetMapping("/assessment-criteria")
    // @ApiMessage("Fetch assessment-criteria")
    public ResponseEntity<ResultPaginationDTO> getCompany(
            @Filter Specification<AssessmentCriteria> spec, Pageable pageable) {

        return ResponseEntity.ok(this.assessmentCriteriaService
                .handleGetAssessmentCriteria(spec, pageable));
    }

    @GetMapping("/assessment-criteria/{id}")
    @APIMessage("Fetch assessment-criteria by id")
    public ResponseEntity<AssessmentCriteria> getAssessmentById(@PathVariable("id") Long assessmentId) {
        AssessmentCriteria createdCriteria = this.assessmentCriteriaService.getAssessmentById(assessmentId);
        return ResponseEntity.ok().body(createdCriteria);
    }

    @PutMapping("/assessment-criteria/{id}")
    public ResponseEntity<AssessmentCriteria> updateAssessmentCriteria(
            @PathVariable("id") Long assessmentId, @RequestBody AssessmentCriteria assessmentCriteria) {
        AssessmentCriteria updatedCriteria = assessmentCriteriaService.updateAssessmentCriteria(assessmentId,
                assessmentCriteria);
        return ResponseEntity.ok().body(updatedCriteria);
    }

    @DeleteMapping("/assessment-criteria/{id}")
    public ResponseEntity<String> deleteAssessmentCriteria(@PathVariable("id") long assessmentCriteriaId) {

        this.assessmentCriteriaService.deleteAssessmentCriteria(assessmentCriteriaId);
        return ResponseEntity.ok()
                .body("Assessment Criteria with ID " + assessmentCriteriaId + " deleted successfully.");
    }
}