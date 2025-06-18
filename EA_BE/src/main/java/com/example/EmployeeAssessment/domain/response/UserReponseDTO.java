package com.example.EmployeeAssessment.domain.response;

import lombok.Data;

@Data
public class UserReponseDTO {
    private long userId;
    private String userName;
    private String email;
    private String role;
}
