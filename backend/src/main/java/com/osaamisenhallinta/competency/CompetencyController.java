package com.osaamisenhallinta.competency;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/** A controller for competency information. */
@RestController
@RequestMapping("/api/competencies")
public class CompetencyController {
  private final CompetencyService competencyService;

  public CompetencyController(CompetencyService competencyService) {
    this.competencyService = competencyService;
  }

  @Operation(summary = "Get a competency by ID")
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
  @GetMapping("/{id}")
  public CompetencyDto getCompetencyById(@PathVariable Long id) {
    return competencyService.getCompetencyById(id);
  }
  
}
