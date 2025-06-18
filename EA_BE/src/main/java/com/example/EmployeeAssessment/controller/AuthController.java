package com.example.EmployeeAssessment.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.ReqLoginDTO;
import com.example.EmployeeAssessment.domain.response.login.ResLoginDTO;
import com.example.EmployeeAssessment.service.AuthService;
import com.example.EmployeeAssessment.service.UserService;
import com.example.EmployeeAssessment.util.SecurityUtil;
import com.example.EmployeeAssessment.util.annotation.APIMessage;
import com.example.EmployeeAssessment.util.error.IdInvalidException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final AuthService authService;

    private final SecurityUtil securityUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Value("${ea.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(AuthService authService,
            AuthenticationManagerBuilder authenticationManagerBuilder,
            SecurityUtil securityUtil,
            PasswordEncoder passwordEncoder,
            UserService userService) {
        this.authService = authService;
        this.securityUtil = securityUtil;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDto) {
        // return this.authService.login(loginDto);
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getPassword());

        // xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject()
                .authenticate(authenticationToken);

        // set thông tin người dùng đăng nhập vào context (có thể sử dụng sau này)
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO res = new ResLoginDTO();
        User currentUserDB = this.userService.handleGetUserByUsername(loginDto.getEmail());
        if (currentUserDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                    currentUserDB.getUserId(),
                    currentUserDB.getEmail(),
                    currentUserDB.getUserName(),
                    currentUserDB.getRole());
            res.setUser(userLogin);
        }

        // create access token
        String access_token = this.securityUtil.createAccessToken(authentication.getName(), res);
        res.setAccessToken(access_token);

        // create refresh token
        String refresh_token = this.securityUtil.createRefreshToken(loginDto.getEmail(), res);

        // update user
        this.userService.updateUserToken(refresh_token, loginDto.getEmail());

        // set cookies
        ResponseCookie resCookies = ResponseCookie
                .from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(res);
    }

    @GetMapping("/auth/account")
    @APIMessage("fetch account")
    public ResponseEntity<ResLoginDTO.UserGetAccount> getAccount() {
        return authService.getAccount();
    }

    @GetMapping("/auth/refresh")
    @APIMessage("Get User by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "abc") String refresh_token) throws IdInvalidException {
        return authService.getRefreshToken(refresh_token);
    }

    @PostMapping("/auth/logout")
    @APIMessage("Logout User")
    public ResponseEntity<Void> logout() throws IdInvalidException {
        return authService.logout();
    }
}
