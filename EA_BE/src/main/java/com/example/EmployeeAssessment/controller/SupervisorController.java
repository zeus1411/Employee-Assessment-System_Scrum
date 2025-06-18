package com.example.EmployeeAssessment.controller;

import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.Team;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.domain.request.TeamRequestDTO;
import com.example.EmployeeAssessment.domain.response.RestResponse;
import com.example.EmployeeAssessment.domain.response.TeamResponeDTO;
import com.example.EmployeeAssessment.service.SupervisorService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SupervisorController {

    private final SupervisorService supervisorService;

    @PostMapping("/teams")
    public ResponseEntity<RestResponse<TeamResponeDTO>> createNewTeam(@Valid @RequestBody TeamRequestDTO teamRequest) {
        TeamResponeDTO teamResponse = supervisorService.createNewTeam(teamRequest);
        RestResponse<TeamResponeDTO> response = new RestResponse<>();
        response.setStatusCode(HttpStatus.CREATED.value());
        response.setData(teamResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/teams")
    public ResponseEntity<ResultPaginationDTO> getListTeam(@Filter Specification<Team> spec, Pageable pageable) {
        return supervisorService.getListTeam(spec, pageable);
    }

    @GetMapping("/members/{tid}")
    public ResponseEntity<ResultPaginationDTO> getTeamMembers(@PathVariable("tid") Long teamId,
            @Filter Specification<User> spec,
            Pageable pageable) {
        return supervisorService.getTeamMembers(teamId, spec, pageable);
    }

    @PutMapping("/teams/{tid}")
    public ResponseEntity<RestResponse<TeamResponeDTO>> updateTeam(@PathVariable("tid") Long teamId,
            @Valid @RequestBody TeamRequestDTO teamRequest) {
        TeamResponeDTO updatedTeam = supervisorService.updateTeam(teamId, teamRequest);
        RestResponse<TeamResponeDTO> response = new RestResponse<>();
        response.setStatusCode(HttpStatus.OK.value());
        response.setData(updatedTeam);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/teams/{tid}")
    public ResponseEntity<RestResponse<String>> deleteTeam(@PathVariable("tid") Long teamId) {
        supervisorService.deleteTeam(teamId);
        RestResponse<String> response = new RestResponse<>();
        response.setStatusCode(HttpStatus.OK.value());
        response.setData("Team deleted successfully");
        return ResponseEntity.ok(response);
    }
}