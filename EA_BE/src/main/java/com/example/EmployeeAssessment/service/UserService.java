package com.example.EmployeeAssessment.service;

import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.ReqUpdateUserDTO;
import com.example.EmployeeAssessment.domain.response.UserReponseDTO;
import com.example.EmployeeAssessment.repository.UserRepository;
import com.example.EmployeeAssessment.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

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
        newUser.setRole(newUser.getRole()); // Set role to null if not provided
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

    public ResultPaginationDTO handleFetchAllUsers(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(spec, pageable);
        ResultPaginationDTO res = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        res.setMeta(meta);
        res.setResult(pageUser.getContent().stream()
                .map(this::convertToUserReponseDTO)
                .collect(Collectors.toList()));

        return res;
    }

    public void handleDeleteUser(Long userId) throws IdInvalidException {
        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User with id = " + userId + " does not exist"));

        if (user.getRole() != null && user.getRole().getRoleName().equals("ADMIN")) {
            throw new IdInvalidException("You cannot delete an admin user");
        }

        this.userRepository.deleteById(userId);
    }

    public UserReponseDTO convertToUserReponseDTO(User user) {
        UserReponseDTO userResponse = new UserReponseDTO();
        userResponse.setUserId(user.getUserId());
        userResponse.setUserName(user.getUserName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole() != null ? user.getRole().getRoleName() : "No Role Assigned");
        return userResponse;
    }

    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }

    public void updateUserToken(String token, String email) {
        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }
}
