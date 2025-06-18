package com.example.EmployeeAssessment.service;

import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.Team;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.response.EmployeeResponeDTO;
import com.example.EmployeeAssessment.domain.response.TeamResponeDTO;
import com.example.EmployeeAssessment.repository.TeamRepository;
import com.example.EmployeeAssessment.repository.UserRepository;
import com.example.EmployeeAssessment.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupervisorService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public ResponseEntity<ResultPaginationDTO> getListTeam(Specification<Team> spec, Pageable pageable) {
        // Lấy email người dùng từ token
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng nhập!");
        }

        // Lấy User từ email
        User supervisor = userService.handleGetUserByUsername(email);
        if (supervisor == null) {
            throw new RuntimeException("Không tìm thấy supervisor với email: " + email);
        }

        // Thêm filter supervisor vào spec
        Specification<Team> supervisorSpec = (root, query, cb) ->
                cb.equal(root.get("supervisor"), supervisor);

        // Combine spec
        Specification<Team> finalSpec = spec == null ? supervisorSpec : spec.and(supervisorSpec);

        // Query phân trang
        Page<Team> page = teamRepository.findAll(finalSpec, pageable);

        // Build response
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        // Map từ Team → TeamResponseDTO
        List<TeamResponeDTO> teamDTOList = page.getContent().stream()
                .map(team -> {
                    TeamResponeDTO dto = new TeamResponeDTO();
                    dto.setTeamId(team.getTeamId());
                    dto.setTeamName(team.getTeamName());
                    return dto;
                })
                .toList();

        rs.setResult(teamDTOList);

        return ResponseEntity.ok().body(rs);
    }


    public ResponseEntity<ResultPaginationDTO> getTeamMembers(Long tid, Specification<User> spec,
                                                  Pageable pageable){
        // Lấy team theo ID
        Optional<Team> teamOptional = teamRepository.findById(tid);
        if (teamOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy team với ID: " + tid);
        }

        // Tạo Specification để lọc theo team_id
        Specification<User> teamSpec = (root, query, cb) ->
                cb.equal(root.join("teams").get("teamId"), tid);

        // Combine spec (nếu có filter thêm)
        Specification<User> finalSpec = (spec == null) ? teamSpec : spec.and(teamSpec);

        // Query phân trang
        Page<User> page = userRepository.findAll(finalSpec, pageable);

        // Build response
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        // Map từ User → EmployeeResponeDTO
        List<EmployeeResponeDTO> memberDTOList = page.getContent().stream()
                .map(user -> {
                    EmployeeResponeDTO dto = new EmployeeResponeDTO();
                    dto.setUserId(user.getUserId());
                    dto.setUserName(user.getUserName());
                    return dto;
                })
                .toList();

        rs.setResult(memberDTOList);

        return ResponseEntity.ok().body(rs);
    }
}
