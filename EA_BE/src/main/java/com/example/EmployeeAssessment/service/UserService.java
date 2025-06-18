package com.example.EmployeeAssessment.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.ReqLoginDTO;
import com.example.EmployeeAssessment.domain.request.ReqUpdateUserDTO;
import com.example.EmployeeAssessment.domain.response.UserReponseDTO;
import com.example.EmployeeAssessment.repository.UserRepository;
import com.example.EmployeeAssessment.util.error.IdInvalidException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Check if the email exists in the database
    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public User handleCreateNewUser(User newUser) throws IdInvalidException {
        boolean isEmailExist = this.isEmailExist(newUser.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException(
                    "Email " + newUser.getEmail() + " already exists, please use another email.");
        }
        String hashPassword = this.passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(hashPassword);
        newUser.setRole(null); // Set role to null if not provided
        User savedUser = userRepository.save(newUser);
        return savedUser;
    }

    public UserReponseDTO handleUpdateUser(Long userId, ReqUpdateUserDTO updatedUser) throws IdInvalidException {
        User existingUser = this.userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User not found with id: " + userId));

        // Update fields
        existingUser.setUserName(updatedUser.getUserName());
        existingUser.setEmail(updatedUser.getEmail());

        // Only update password if provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            String hashPassword = this.passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(hashPassword);
        }

        // Update role if provided
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }

        User savedUser = this.userRepository.save(existingUser);
        return this.convertToUserReponseDTO(savedUser);
    }

    public User getUserById(Long userId) throws IdInvalidException {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User not found with id: " + userId));
    }

    public UserReponseDTO convertToUserReponseDTO(User user) {
        UserReponseDTO userResponse = new UserReponseDTO();
        userResponse.setUserId(user.getUserId());
        userResponse.setUserName(user.getUserName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole() != null ? user.getRole().getRoleName() : "No Role Assigned");
        return userResponse;
    }
}
