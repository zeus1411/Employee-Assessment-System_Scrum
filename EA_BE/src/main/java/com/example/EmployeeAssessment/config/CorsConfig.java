package com.example.EmployeeAssessment.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // cho phép các URL nào có thể kết nối tới backend
        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:3000","https://localhost:3000"));

        // các method nào đc kết nối
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // các phần header được phép gửi lên
        // configuration.setAllowedHeaders(Arrays.asList("Authorization",
        // "Content-Type", "Accept", "x-no-retry"));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setExposedHeaders(List.of("*"));
        // gửi kèm cookies hay không
        configuration.setAllowCredentials(true);

        // thời gian pre-flight request có thể cache (tính theo seconds)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // cấu hình cors cho tất cả api
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}