package com.example.EmployeeAssessment.controller;

import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.ReqUpdateUserDTO;
import com.example.EmployeeAssessment.domain.response.RestResponse;
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
    public ResponseEntity<RestResponse<UserReponseDTO>> createNewUser(@Valid @RequestBody User newUser) {
        RestResponse<UserReponseDTO> response = new RestResponse<>();
        try {
            User user = userService.handleCreateNewUser(newUser);
            UserReponseDTO userResponse = userService.convertToUserReponseDTO(user);
            response.setStatusCode(HttpStatus.CREATED.value());
            response.setData(userResponse);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IdInvalidException e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Invalid user ID"); // Thêm thông báo lỗi nếu cần
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    @PutMapping("/users/{id}")
    public ResponseEntity<RestResponse<UserReponseDTO>> updateUser(
            @PathVariable("id") Long userId,
            @Valid @RequestBody ReqUpdateUserDTO updatedUser) {

        RestResponse<UserReponseDTO> response = new RestResponse<>();
        try {
            UserReponseDTO updated = userService.handleUpdateUser(userId, updatedUser);
            response.setStatusCode(HttpStatus.OK.value());
            response.setData(updated);
            return ResponseEntity.ok(response);
        } catch (IdInvalidException e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Invalid user ID");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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
    public ResponseEntity<RestResponse<Void>> deleteUser(@PathVariable("id") Long userId) {
        RestResponse<Void> response = new RestResponse<>();
        try {
            userService.handleDeleteUser(userId);
            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IdInvalidException e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Invalid user ID");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

}
