package com.example.EmployeeAssessment.service;

import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.Role;
import com.example.EmployeeAssessment.domain.Team;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.TeamRequestDTO;
import com.example.EmployeeAssessment.domain.response.EmployeeResponeDTO;
import com.example.EmployeeAssessment.domain.response.TeamResponeDTO;
import com.example.EmployeeAssessment.repository.TeamRepository;
import com.example.EmployeeAssessment.repository.UserRepository;
import com.example.EmployeeAssessment.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupervisorService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(SupervisorService.class);

    public ResponseEntity<ResultPaginationDTO> getListTeam(Specification<Team> spec, Pageable pageable) {
        logger.info("Fetching team list for page: {}, pageSize: {}", pageable.getPageNumber(), pageable.getPageSize());

        // Lấy email người dùng từ token
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng nhập!");
        }

        // Lấy User từ email
        User currentUser = userService.handleGetUserByUsername(email);
        if (currentUser == null) {
            throw new RuntimeException("Không tìm thấy người dùng với email: " + email);
        }

        // Kiểm tra role_id của người dùng
        Role userRole = currentUser.getRole();
        if (userRole == null || (userRole.getRoleId() != 1 && userRole.getRoleId() != 2)) {
            throw new RuntimeException("Bạn không có quyền xem danh sách team!");
        }

        Specification<Team> finalSpec;

        // Nếu là SUPERVISOR (role_id = 2), chỉ lấy các team mà họ quản lý
        if (userRole.getRoleId() == 2) {
            Specification<Team> supervisorSpec = (root, query, cb) ->
                    cb.equal(root.get("supervisor"), currentUser);
            finalSpec = (spec == null) ? supervisorSpec : spec.and(supervisorSpec);
        } else {
            // Nếu là ADMIN (role_id = 1), không áp dụng filter supervisor
            finalSpec = spec;
        }

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

    public ResponseEntity<ResultPaginationDTO> getTeamMembers(Long tid, Specification<User> spec, Pageable pageable) {
        logger.info("Fetching members for teamId: {}, page: {}, pageSize: {}", tid, pageable.getPageNumber(), pageable.getPageSize());

        // Lấy team theo ID
        Optional<Team> teamOptional = teamRepository.findById(tid);
        if (teamOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy team với ID: " + tid);
        }

        // Kiểm tra quyền truy cập team
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng nhập!");
        }

        User currentUser = userService.handleGetUserByUsername(email);
        if (currentUser == null) {
            throw new RuntimeException("Không tìm thấy người dùng với email: " + email);
        }

        Role userRole = currentUser.getRole();
        if (userRole == null || (userRole.getRoleId() != 1 && userRole.getRoleId() != 2)) {
            throw new RuntimeException("Bạn không có quyền xem thành viên của team này!");
        }

        // Nếu là SUPERVISOR, kiểm tra xem họ có quản lý team này không
        if (userRole.getRoleId() == 2 && teamOptional.get().getSupervisor().getUserId() != currentUser.getUserId()) {
            throw new RuntimeException("Bạn không có quyền xem thành viên của team này!");
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

    @Transactional
    public TeamResponeDTO createNewTeam(TeamRequestDTO teamRequest) {
        logger.info("Starting createNewTeam with teamName: {}", teamRequest.getTeamName());

        // Lấy email người dùng từ token
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng nhập!");
        }

        // Lấy User từ email
        User currentUser = userService.handleGetUserByUsername(email);
        if (currentUser == null) {
            throw new RuntimeException("Không tìm thấy người dùng với email: " + email);
        }

        // Kiểm tra role_id của người dùng
        Role userRole = currentUser.getRole();
        if (userRole == null || (userRole.getRoleId() != 1 && userRole.getRoleId() != 2)) {
            throw new RuntimeException("Bạn không có quyền tạo team!");
        }

        // Validate teamName
        if (teamRequest.getTeamName() == null || teamRequest.getTeamName().trim().isEmpty()) {
            throw new RuntimeException("Tên team không được để trống!");
        }

        // Tạo Team entity
        Team newTeam = new Team();
        newTeam.setTeamName(teamRequest.getTeamName());

        // Validate and set supervisor
        if (teamRequest.getSupervisorId() != null && teamRequest.getSupervisorId() > 0) {
            User supervisor = userRepository.findById(teamRequest.getSupervisorId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy supervisor với ID: " + teamRequest.getSupervisorId()));
            Role supervisorRole = supervisor.getRole();
            if (supervisorRole == null || (supervisorRole.getRoleId() != 1 && supervisorRole.getRoleId() != 2)) {
                throw new RuntimeException("Người dùng với ID " + teamRequest.getSupervisorId() + " không có quyền làm supervisor!");
            }
            newTeam.setSupervisor(supervisor);
            logger.info("Supervisor set with userId: {}", teamRequest.getSupervisorId());
        } else {
            newTeam.setSupervisor(currentUser);
            logger.info("No supervisor provided, setting current user as supervisor with userId: {}", currentUser.getUserId());
        }

        // Validate and set members
        if (teamRequest.getMemberIds() != null && !teamRequest.getMemberIds().isEmpty()) {
            List<User> members = teamRequest.getMemberIds().stream()
                    .map(userId -> {
                        User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + userId));
                        logger.info("Found member with userId: {}", userId);
                        return user;
                    })
                    .collect(Collectors.toList());
            newTeam.setMembers(members);
            logger.info("Members set with count: {}", members.size());
        } else {
            logger.info("No members provided for the team");
        }

        // Lưu team mới
        Team savedTeam = teamRepository.save(newTeam);
        logger.info("Team saved with teamId: {}", savedTeam.getTeamId());

        // Verify members in team_user table
        if (teamRequest.getMemberIds() != null && !teamRequest.getMemberIds().isEmpty()) {
            List<User> savedMembers = savedTeam.getMembers();
            logger.info("Saved team has {} members", savedMembers != null ? savedMembers.size() : 0);
        }

        // Map từ Team → TeamResponseDTO
        TeamResponeDTO teamDTO = new TeamResponeDTO();
        teamDTO.setTeamId(savedTeam.getTeamId());
        teamDTO.setTeamName(savedTeam.getTeamName());

        return teamDTO;
    }
}