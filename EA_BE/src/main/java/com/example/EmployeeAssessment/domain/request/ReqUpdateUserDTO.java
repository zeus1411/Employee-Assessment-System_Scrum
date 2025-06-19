package com.example.EmployeeAssessment.domain.request;

import com.example.EmployeeAssessment.domain.Role;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReqUpdateUserDTO {
    @NotBlank(message = "username không được để trống")
    private String userName;
    
    @NotBlank(message = "email không được để trống")
    private String email;
    
    private String password;
    private Role role;
}
