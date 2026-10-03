package com.osaamisenhallinta.backend.supervisor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for supervisor information. */
@RestController
@RequestMapping("/api/supervisors")
public class SupervisorController {
  private final SupervisorService supervisorService;

  public SupervisorController(SupervisorService supervisorService) {
    this.supervisorService = supervisorService;
  }

  @GetMapping("/{id}/overview")
  public SupervisorOverviewDto getSupervisorById(@PathVariable Long id) {
    return supervisorService.getSupervisorById(id);
  }
}
