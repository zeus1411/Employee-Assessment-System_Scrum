package com.example.EmployeeAssessment.domain.request;

import lombok.Data;

import java.util.List;

@Data
public class TeamRequestDTO {
    private String teamName;
    private Long supervisorId;
    private List<Long> memberIds;
}