package com.example.EmployeeAssessment.service;

import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.Role;
import com.example.EmployeeAssessment.domain.Team;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.TeamRequestDTO;
import com.example.EmployeeAssessment.domain.response.EmployeeResponeDTO;
import com.example.EmployeeAssessment.domain.response.TeamResponseDTO;
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
            throw new RuntimeException("Bạn không có quyền xem danh sách team!");
        }

        Specification<Team> finalSpec;
        if (userRole.getRoleId() == 2) {
            Specification<Team> supervisorSpec = (root, query, cb) -> cb.equal(root.get("supervisor"), currentUser);
            finalSpec = (spec == null) ? supervisorSpec : spec.and(supervisorSpec);
        } else {
            finalSpec = spec;
        }

        Page<Team> page = teamRepository.findAll(finalSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);

        // Ánh xạ Team sang TeamResponseDTO
        List<TeamResponseDTO> teamDTOList = page.getContent().stream()
                .map(team -> {
                    TeamResponseDTO dto = new TeamResponseDTO();
                    dto.setTeamId(team.getTeamId());
                    dto.setTeamName(team.getTeamName());

                    // Ánh xạ Supervisor
                    if (team.getSupervisor() != null) {
                        TeamResponseDTO.Supervisor supervisor = new TeamResponseDTO.Supervisor();
                        supervisor.setSupervisorId(team.getSupervisor().getUserId());
                        supervisor.setSupervisorName(team.getSupervisor().getUserName());
                        dto.setSupervisor(supervisor);
                    }

                    // Ánh xạ Members
                    if (team.getMembers() != null) {
                        List<TeamResponseDTO.UserDTO> memberDTOs = team.getMembers().stream()
                                .map(member -> {
                                    TeamResponseDTO.UserDTO userDTO = new TeamResponseDTO.UserDTO();
                                    userDTO.setUserId(member.getUserId());
                                    userDTO.setUsername(member.getUserName());
                                    userDTO.setEmail(member.getEmail());
                                    return userDTO;
                                })
                                .toList();
                        dto.setMembers(memberDTOs);
                    }

                    return dto;
                })
                .toList();

        rs.setResult(teamDTOList);

        return ResponseEntity.ok().body(rs);
    }

    public ResponseEntity<ResultPaginationDTO> getTeamMembers(Long tid, Specification<User> spec, Pageable pageable) {
        logger.info("Fetching members for teamId: {}, page: {}, pageSize: {}", tid, pageable.getPageNumber(),
                pageable.getPageSize());

        Optional<Team> teamOptional = teamRepository.findById(tid);
        if (teamOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy team với ID: " + tid);
        }

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

        if (userRole.getRoleId() == 2 && teamOptional.get().getSupervisor().getUserId() != currentUser.getUserId()) {
            throw new RuntimeException("Bạn không có quyền xem thành viên của team này!");
        }

        Specification<User> teamSpec = (root, query, cb) -> cb.equal(root.join("teams").get("teamId"), tid);
        Specification<User> finalSpec = (spec == null) ? teamSpec : spec.and(teamSpec);

        Page<User> page = userRepository.findAll(finalSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);

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
    public TeamResponseDTO createNewTeam(TeamRequestDTO teamRequest) {
        logger.info("Starting createNewTeam with teamName: {}", teamRequest.getTeamName());

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
            throw new RuntimeException("Bạn không có quyền tạo team!");
        }

        if (teamRequest.getTeamName() == null || teamRequest.getTeamName().trim().isEmpty()) {
            throw new RuntimeException("Tên team không được để trống!");
        }

        Team newTeam = new Team();
        newTeam.setTeamName(teamRequest.getTeamName());

        if (teamRequest.getSupervisorId() != null && teamRequest.getSupervisorId() > 0) {
            User supervisor = userRepository.findById(teamRequest.getSupervisorId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy supervisor với ID: " + teamRequest.getSupervisorId()));
            Role supervisorRole = supervisor.getRole();
            if (supervisorRole == null || (supervisorRole.getRoleId() != 1 && supervisorRole.getRoleId() != 2)) {
                throw new RuntimeException(
                        "Người dùng với ID " + teamRequest.getSupervisorId() + " không có quyền làm supervisor!");
            }
            newTeam.setSupervisor(supervisor);
            logger.info("Supervisor set with userId: {}", teamRequest.getSupervisorId());
        } else {
            newTeam.setSupervisor(currentUser);
            logger.info("No supervisor provided, setting current user as supervisor with userId: {}",
                    currentUser.getUserId());
        }

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

        Team savedTeam = teamRepository.save(newTeam);
        logger.info("Team saved with teamId: {}", savedTeam.getTeamId());

        if (teamRequest.getMemberIds() != null && !teamRequest.getMemberIds().isEmpty()) {
            List<User> savedMembers = savedTeam.getMembers();
            logger.info("Saved team has {} members", savedMembers != null ? savedMembers.size() : 0);
        }

        TeamResponseDTO teamDTO = new TeamResponseDTO();
        teamDTO.setTeamId(savedTeam.getTeamId());
        teamDTO.setTeamName(savedTeam.getTeamName());
        return teamDTO;
    }

    @Transactional
    public TeamResponseDTO updateTeam(Long teamId, TeamRequestDTO teamRequest) {
        logger.info("Starting updateTeam with teamId: {}", teamId);

        // Lấy team theo ID
        Team existingTeam = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team với ID: " + teamId));

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

        // Kiểm tra quyền truy cập
        Role userRole = currentUser.getRole();
        if (userRole == null || (userRole.getRoleId() != 1 && userRole.getRoleId() != 2)) {
            throw new RuntimeException("Bạn không có quyền cập nhật team này!");
        }

        // Nếu là SUPERVISOR, kiểm tra xem họ có quản lý team này không
        if (userRole.getRoleId() == 2 && existingTeam.getSupervisor().getUserId() != currentUser.getUserId()) {
            throw new RuntimeException("Bạn không có quyền cập nhật team này!");
        }

        // Cập nhật tên team
        if (teamRequest.getTeamName() != null && !teamRequest.getTeamName().trim().isEmpty()) {
            existingTeam.setTeamName(teamRequest.getTeamName());
            logger.info("Updated team name to: {}", teamRequest.getTeamName());
        } else {
            throw new RuntimeException("Tên team không được để trống!");
        }

        // Cập nhật supervisor nếu có
        if (teamRequest.getSupervisorId() != null && teamRequest.getSupervisorId() > 0) {
            User supervisor = userRepository.findById(teamRequest.getSupervisorId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy supervisor với ID: " + teamRequest.getSupervisorId()));
            Role supervisorRole = supervisor.getRole();
            if (supervisorRole == null || (supervisorRole.getRoleId() != 1 && supervisorRole.getRoleId() != 2)) {
                throw new RuntimeException(
                        "Người dùng với ID " + teamRequest.getSupervisorId() + " không có quyền làm supervisor!");
            }
            existingTeam.setSupervisor(supervisor);
            logger.info("Updated supervisor to userId: {}", teamRequest.getSupervisorId());
        } else {
            // Không thay đổi supervisor nếu không cung cấp
            logger.info("No supervisorId provided, keeping existing supervisor with userId: {}",
                    existingTeam.getSupervisor().getUserId());
        }

        // Cập nhật members nếu có
        if (teamRequest.getMemberIds() != null) {
            // Xóa tất cả members hiện tại trong team_user
            existingTeam.getMembers().clear();
            logger.info("Cleared existing members for teamId: {}", teamId);

            // Thêm members mới
            if (!teamRequest.getMemberIds().isEmpty()) {
                List<User> members = teamRequest.getMemberIds().stream()
                        .map(userId -> {
                            User user = userRepository.findById(userId)
                                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + userId));
                            logger.info("Found member with userId: {}", userId);
                            return user;
                        })
                        .collect(Collectors.toList());
                existingTeam.setMembers(members);
                logger.info("Updated members with count: {}", members.size());
            } else {
                logger.info("No members provided, team will have no members");
            }
        } else {
            logger.info("No memberIds provided, keeping existing members");
        }

        // Lưu team đã cập nhật
        Team updatedTeam = teamRepository.save(existingTeam);
        logger.info("Team updated with teamId: {}", updatedTeam.getTeamId());

        // Verify members
        List<User> savedMembers = updatedTeam.getMembers();
        logger.info("Updated team has {} members", savedMembers != null ? savedMembers.size() : 0);

        // Map từ Team → TeamResponseDTO
        TeamResponseDTO teamDTO = new TeamResponseDTO();
        teamDTO.setTeamId(updatedTeam.getTeamId());
        teamDTO.setTeamName(updatedTeam.getTeamName());
        return teamDTO;
    }

    @Transactional
    public void deleteTeam(Long teamId) {
        logger.info("Starting deleteTeam with teamId: {}", teamId);

        // Lấy team theo ID
        Team existingTeam = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team với ID: " + teamId));

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

        // Kiểm tra quyền truy cập
        Role userRole = currentUser.getRole();
        if (userRole == null || (userRole.getRoleId() != 1 && userRole.getRoleId() != 2)) {
            throw new RuntimeException("Bạn không có quyền xóa team này!");
        }

        // Nếu là SUPERVISOR, kiểm tra xem họ có quản lý team này không
        if (userRole.getRoleId() == 2 && existingTeam.getSupervisor().getUserId() != currentUser.getUserId()) {
            throw new RuntimeException("Bạn không có quyền xóa team này!");
        }

        // Xóa team (cascade sẽ xóa các bản ghi liên quan trong team_user)
        teamRepository.delete(existingTeam);
        logger.info("Team deleted with teamId: {}", teamId);
    }

    public Team getTeamById(Long teamId) {
        logger.info("Fetching team by ID: {}", teamId);
        Team team = teamRepository.findById(teamId).get();
        return team;

    }
}