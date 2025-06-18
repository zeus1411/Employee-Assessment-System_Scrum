package com.example.EmployeeAssessment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.EmployeeAssessment.domain.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{
    Optional<Role> findByRoleName(String roleName);
}   

    
