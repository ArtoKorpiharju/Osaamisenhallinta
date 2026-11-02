package com.osaamisenhallinta.competency;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
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
          @ApiResponse(
              responseCode = "404",
              description = "Competency not found",
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

  @Operation(summary = "Get all competencies")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successful operation"),
          @ApiResponse(
              responseCode = "500",
              description = "Internal server error",
              content = @Content)
      })
  @GetMapping("/")
  public List<CompetencyDto> getAllCompetencies() {
    return competencyService.getAllCompetencies();
  }

  @Operation(summary = "Create a new competency")
  @ApiResponses(
      value = {
          @ApiResponse(
            responseCode = "201", 
            description = "Competency created successfully"),
          @ApiResponse(
            responseCode = "400", 
            description = "Competency already exists", 
            content = @Content),
          @ApiResponse(
              responseCode = "500",
              description = "Internal server error",
              content = @Content)
      })
  @PostMapping()
  @ResponseStatus(HttpStatus.CREATED)
  public CompetencyDto createCompetency(String name, CompetencyType type, Integer validityMonths) {
    return competencyService.createCompetency(name, type, validityMonths);
  }

  @Operation(summary = "Delete a competency")
  @ApiResponses(
      value = {
          @ApiResponse(
            responseCode = "204", 
            description = "Competency successfully deleted"),
          @ApiResponse(
            responseCode = "400", 
            description = "Competency is in use by a qualification", 
            content = @Content),
          @ApiResponse(
              responseCode = "404",
              description = "Competency not found",
              content = @Content),
          @ApiResponse(
              responseCode = "500",
              description = "Internal server error",
              content = @Content)
      })
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCompetency(@PathVariable Long id) {
    competencyService.deleteCompetency(id);
    return;
  }
  
}
