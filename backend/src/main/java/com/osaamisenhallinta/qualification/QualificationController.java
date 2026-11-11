package com.osaamisenhallinta.qualification;

import com.osaamisenhallinta.qualification.dto.CreateQualificationDto;
import com.osaamisenhallinta.qualification.dto.QualificationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


/** A controller for qualification information. */
@RestController
@RequestMapping("/api/qualifications")
@Tag(
    name = "Qualifications",
    description = "Endpoints for managing qualifications")
public class QualificationController {
  private final QualificationService qualificationService;

  // Constructor
  public QualificationController(QualificationService qualificationService) {
    this.qualificationService = qualificationService;
  }

  @Operation(summary = "Get a qualification by ID")
  @ApiResponses(
      value = {
          @ApiResponse(
            responseCode = "200", 
            description = "Successful operation"),
          @ApiResponse(
              responseCode = "400",
              description = "Missing or invalid parameter(s)",
              content = @Content),
          @ApiResponse(
              responseCode = "404",
              description = "Qualification not found",
              content = @Content)
      })
  @GetMapping("/{id}")
  public QualificationDto getQualificationById(@PathVariable Long id) {
    return qualificationService.getQualificationById(id);
  }

  @Operation(summary = "Get all qualifications")
  @ApiResponses(
      value = {
          @ApiResponse(
            responseCode = "200",
            description = "Successful operation")
      })
  @GetMapping()
  public List<QualificationDto> getAllQualifications() {
    return qualificationService.getAllQualifications();
  }

  @Operation(summary = "Create a new qualification")
  @ApiResponses(
      value = {
          @ApiResponse(
            responseCode = "201", 
            description = "Qualification created successfully"),
          @ApiResponse(
            responseCode = "400",
            description = "Missing or invalid parameter(s)",
            content = @Content),
          @ApiResponse(
            responseCode = "404",
            description = "One or more required competencies not found",
            content = @Content),
          @ApiResponse(
            responseCode = "409", 
            description = "Qualification already exists", 
            content = @Content)
      })
  @PostMapping()
  @ResponseStatus(HttpStatus.CREATED)
  public QualificationDto createQualification(@Valid @RequestBody CreateQualificationDto dto) {
    return qualificationService.createQualification(dto.name(), dto.requiredCompetenciesIds());
  }
}
