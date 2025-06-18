package com.example.EmployeeAssessment.config;

import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.EmployeeAssessment.service.UserService;

@Component("UserDetailsService") // Đổi tên bean để tránh xung đột
public class UserDetailsCustom implements UserDetailsService {

    private final UserService userService;

    public UserDetailsCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.example.EmployeeAssessment.domain.User user = this.userService.handleGetUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Username/password không hợp lệ");
        }
        return new User(
                user.getUserName(), // Sử dụng userName thay vì email để nhất quán
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getRoleName()))); // Gán đúng vai trò
    }
}