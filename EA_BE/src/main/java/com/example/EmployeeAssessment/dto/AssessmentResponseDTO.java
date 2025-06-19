package com.example.EmployeeAssessment.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.EmployeeAssessment.domain.AssessmentCriteria;

public class AssessmentResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double score;
    private String feedback;
    private List<AssessmentCriteria> criteriaList;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Long supervisorId;
    private String supervisorName;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Double getScore() {
        return score;
    }
    
    public void setScore(Double score) {
        this.score = score;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    
    public List<AssessmentCriteria> getCriteriaList() {
        return criteriaList;
    }
    
    public void setCriteriaList(List<AssessmentCriteria> criteriaList) {
        this.criteriaList = criteriaList;
    }
    
    public Long getSupervisorId() {
        return supervisorId;
    }
    
    public void setSupervisorId(Long supervisorId) {
        this.supervisorId = supervisorId;
    }
    
    public String getSupervisorName() {
        return supervisorName;
    }
    
    public void setSupervisorName(String supervisorName) {
        this.supervisorName = supervisorName;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}