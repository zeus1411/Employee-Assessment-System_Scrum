package com.example.EmployeeAssessment.config;

import com.example.EmployeeAssessment.domain.Role;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.repository.RoleRepository;
import com.example.EmployeeAssessment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseInitializer {

    @Bean
    public CommandLineRunner initRolesAndUsers(UserRepository userRepository, RoleRepository roleRepository,
                                              PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if ADMIN role exists, create if not
            Role adminRole = roleRepository.findByRoleName("ADMIN")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setRoleName("ADMIN");
                        newRole.setDescription("Administrator role with full access");
                        return roleRepository.save(newRole);
                    });

            // Check if SUPERVISOR role exists, create if not
            Role supervisorRole = roleRepository.findByRoleName("SUPERVISOR")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setRoleName("SUPERVISOR");
                        newRole.setDescription("Supervisor role with limited access to create assessments for team members");
                        return roleRepository.save(newRole);
                    });

            // Check if admin user exists, create if not
            if (userRepository.findByUserName("admin").isEmpty()) {
                User admin = new User();
                admin.setUserName("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@example.com");
                admin.setRole(adminRole);
                userRepository.save(admin);
            }

            // Check if supervisor user exists, create if not
            if (userRepository.findByUserName("supervisor").isEmpty()) {
                User supervisor = new User();
                supervisor.setUserName("supervisor");
                supervisor.setPassword(passwordEncoder.encode("supervisor123"));
                supervisor.setEmail("supervisor@example.com");
                supervisor.setRole(supervisorRole);
                userRepository.save(supervisor);
            }

            System.out.println(">>> Database initialization completed");
        };
    }
}