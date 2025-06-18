package com.example.EmployeeAssessment.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.response.UserReponseDTO;
import com.example.EmployeeAssessment.repository.UserRepository;
import com.example.EmployeeAssessment.service.UserService;
import com.example.EmployeeAssessment.util.error.IdInvalidException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/users")
    public ResponseEntity<UserReponseDTO> createNewUser(@Valid @RequestBody User newUser) {
        try {
            User user = this.userService.handleCreateNewUser(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToUserReponseDTO(user));
        } catch (IdInvalidException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}
