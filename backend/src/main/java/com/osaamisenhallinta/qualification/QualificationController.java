package com.osaamisenhallinta.qualification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for qualification information. */
@RestController
@RequestMapping("/api/qualifications")
public class QualificationController {
  private final QualificationService qualificationService;

  // Constructor
  public QualificationController(QualificationService qualificationService) {
    this.qualificationService = qualificationService;
  }

  @Operation(summary = "Get a qualification by ID")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successful operation"),
          @ApiResponse(
              responseCode = "404",
              description = "Qualification not found",
              content = @Content),
          @ApiResponse(
              responseCode = "500",
              description = "Internal server error",
              content = @Content)
      })
  @GetMapping("/{id}")
  public QualificationDto getQualificationById(@PathVariable Long id) {
    return qualificationService.getQualificationById(id);
  }

  @Operation(summary = "Get all qualifications")
  @ApiResponses(
      value = {
          @ApiResponse(responseCode = "200", description = "Successful operation"),
          @ApiResponse(
              responseCode = "500",
              description = "Internal server error",
              content = @Content)
      })
  @GetMapping("/")
  public List<QualificationDto> getAllQualifications() {
    return qualificationService.getAllQualifications();
  }
  
}
