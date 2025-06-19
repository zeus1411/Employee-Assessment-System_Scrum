package com.example.EmployeeAssessment.dto;

import java.util.List;

public class AdminAssessmentDTO {
    private String employeeName;
    private List<String> criteriaNames;
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public List<String> getCriteriaNames() {
        return criteriaNames;
    }
    
    public void setCriteriaNames(List<String> criteriaNames) {
        this.criteriaNames = criteriaNames;
    }
}
