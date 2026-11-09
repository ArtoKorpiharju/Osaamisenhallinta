package com.osaamisenhallinta.supervisor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

  @Operation(summary = "Get supervisor overview by ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successful operation"),
        @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
        @ApiResponse(
            responseCode = "404",
            description = "Supervisor not found",
            content = @Content),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content)
      })
  @GetMapping("/{id}/overview")
  public SupervisorOverviewDto getSupervisorById(@PathVariable Long id) {
    return supervisorService.getSupervisorById(id);
  }
}
