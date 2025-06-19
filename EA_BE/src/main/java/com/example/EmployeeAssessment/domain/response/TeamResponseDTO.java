package com.example.EmployeeAssessment.domain.response;

import java.util.List;

import lombok.Data;

@Data
public class TeamResponseDTO {
    private long teamId;
    private String teamName;

    private Supervisor supervisor;
    private List<UserDTO> members; // Thay User bằng UserDTO để tránh trả về entity thô

    @Data
    public static class Supervisor {
        private long supervisorId;
        private String supervisorName;
    }

    @Data
    public static class UserDTO {
        private long userId;
        private String username;
        private String email;
    }
}
