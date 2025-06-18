package com.example.EmployeeAssessment.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.example.EmployeeAssessment.domain.User;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    User findByEmail(String email);

    User findByRefreshTokenAndEmail(String token, String email);

    boolean existsByEmail(String email);

    Optional<User> findByUserName(String userName);

}
