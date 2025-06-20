package com.example.EmployeeAssessment.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.EmployeeAssessment.domain.AssessmentCriteria;
import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.repository.AssessmentCriteriaRepository;

@Service
public class AssessmentCriteriaService {
    private final AssessmentCriteriaRepository assessmentCriteriaRepository;

    public AssessmentCriteriaService(AssessmentCriteriaRepository assessmentCriteriaRepository) {
        this.assessmentCriteriaRepository = assessmentCriteriaRepository;
    }

    // save
    public AssessmentCriteria save(AssessmentCriteria assessmentCriteria) {
        return assessmentCriteriaRepository.save(assessmentCriteria);
    }

    // findAll
    public ResultPaginationDTO handleGetAssessmentCriteria(Specification<AssessmentCriteria> spec, Pageable pageable) {
        Page<AssessmentCriteria> pageAssessmentCriteria = this.assessmentCriteriaRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageAssessmentCriteria.getTotalPages());
        mt.setTotal(pageAssessmentCriteria.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageAssessmentCriteria.getContent());
        return rs;
    }

    // update
    public AssessmentCriteria updateAssessmentCriteria(Long assessmentId, AssessmentCriteria assessmentCriteria) {
        Optional<AssessmentCriteria> assessmentCriteriaOptional = this.assessmentCriteriaRepository
                .findById(assessmentId);
        if (assessmentCriteriaOptional.isPresent()) {
            AssessmentCriteria currentAssessmentCriteria = assessmentCriteriaOptional.get();
            currentAssessmentCriteria.setCriteriaName(assessmentCriteria.getCriteriaName());
            currentAssessmentCriteria.setDescription(assessmentCriteria.getDescription());
            return this.assessmentCriteriaRepository.save(currentAssessmentCriteria);
        }
        return null;
    }

    // delete
    public void deleteAssessmentCriteria(long assessmentCriteriaId) {
        Optional<AssessmentCriteria> assessmentCriteriaOptional = this.assessmentCriteriaRepository
                .findById(assessmentCriteriaId);
        if (assessmentCriteriaOptional.isPresent())
            this.assessmentCriteriaRepository.delete(assessmentCriteriaOptional.get());
    }

    public AssessmentCriteria getAssessmentById(long assessmentCriteriaId) {
        Optional<AssessmentCriteria> assessmentCriteriaOptional = this.assessmentCriteriaRepository
                .findById(assessmentCriteriaId);
        if (assessmentCriteriaOptional.isPresent()) {
            return assessmentCriteriaOptional.get();
        }
        return null;

    }

    public boolean existsByCriteriaName(String criteriaName) {
        return assessmentCriteriaRepository.existsByCriteriaName(criteriaName);
    }

}