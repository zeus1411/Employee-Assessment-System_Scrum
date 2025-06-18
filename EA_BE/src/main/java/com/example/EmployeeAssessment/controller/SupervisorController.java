package com.example.EmployeeAssessment.controller;

import com.example.EmployeeAssessment.domain.ResultPaginationDTO;
import com.example.EmployeeAssessment.domain.Team;
import com.example.EmployeeAssessment.domain.User;
import com.example.EmployeeAssessment.service.SupervisorService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SupervisorController {

    private final SupervisorService supervisorService;

    @GetMapping("/teams")
    public ResponseEntity<ResultPaginationDTO> getListTeam(@Filter Specification<Team> spec,
                                                           Pageable pageable){
        return supervisorService.getListTeam(spec, pageable);
    }

    @GetMapping("/members/{tid}")
    public ResponseEntity<ResultPaginationDTO> getTeamMembers(@PathVariable("tid") Long teamId,
                                                  @Filter Specification<User> spec,
                                                  Pageable pageable){
        return supervisorService.getTeamMembers(teamId, spec, pageable);
    }

}
