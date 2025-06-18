package com.example.EmployeeAssessment.controller;

<<<<<<< HEAD
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
=======
import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
>>>>>>> eab59e0f882256de36d08a6814f560e9fde1f609
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.ReqUpdateUserDTO;
import com.example.EmployeeAssessment.domain.response.UserReponseDTO;
import com.example.EmployeeAssessment.service.UserService;
import com.example.EmployeeAssessment.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/users")
    public ResponseEntity<UserReponseDTO> createNewUser(@Valid @RequestBody User newUser) {
        try {
            User user = this.userService.handleCreateNewUser(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToUserReponseDTO(user));
        } catch (IdInvalidException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserReponseDTO> updateUser(@PathVariable("id") Long userId,
            @Valid @RequestBody ReqUpdateUserDTO updatedUser) {
        try {
            UserReponseDTO updated = this.userService.handleUpdateUser(userId, updatedUser);
            return ResponseEntity.ok(updated);
        } catch (IdInvalidException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserReponseDTO> getUser(@PathVariable("id") Long userId) {
        try {
            User user = this.userService.getUserById(userId);
            return ResponseEntity.ok(this.userService.convertToUserReponseDTO(user));
        } catch (IdInvalidException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ResultPaginationDTO> getAllUsers(
            @Filter Specification<User> spec,
            Pageable pageable) {
        return ResponseEntity.ok(this.userService.handleFetchAllUsers(spec, pageable));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long userId) {
        try {
            this.userService.handleDeleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (IdInvalidException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}