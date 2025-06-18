package com.example.EmployeeAssessment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication(exclude =
org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class)
public class EmployeeAssessmentApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeAssessmentApplication.class, args);
	}

}
