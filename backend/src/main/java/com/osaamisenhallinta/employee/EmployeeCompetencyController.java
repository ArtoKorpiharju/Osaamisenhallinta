package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.employee.dto.AddEmployeeCompetencyRequestDto;
import com.osaamisenhallinta.employee.dto.EmployeeCompetencyDto;
import com.osaamisenhallinta.employee.dto.UpdateEmployeeCompetencyRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** A controller for employee competencies. */
@RestController
@RequestMapping("/api/employees/{employeeId}/competencies")
@RequiredArgsConstructor
@Tag(
    name = "Employee Competencies",
    description = "Endpoints for managing the competencies assigned to an employee")
public class EmployeeCompetencyController {

  private final EmployeeCompetencyService employeeCompetencyService;

  @Operation(
      summary = "Assign a competency to an employee",
      description =
          "Creates a new record linking a competency to a specific employee with an issue date.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "201",
            description = "Competency successfully assigned to the employee"),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request payload (e.g., missing issue date)",
            content = @Content),
        @ApiResponse(
            responseCode = "404",
            description = "Employee or Competency ID not found",
            content = @Content),
        @ApiResponse(
            responseCode = "409",
            description = "Employee already has this competency",
            content = @Content)
      })
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EmployeeCompetencyDto addCompetency(
      @PathVariable Long employeeId, @Valid @RequestBody AddEmployeeCompetencyRequestDto request) {
    return employeeCompetencyService.addCompetency(employeeId, request);
  }

  @Operation(
      summary = "Update an employee's competency",
      description =
          "Updates the issue date of an existing employee competency. The expiration date is automatically recalculated.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Employee competency successfully updated"),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request payload",
            content = @Content),
        @ApiResponse(
            responseCode = "404",
            description = "EmployeeCompetency not found, or employee ID mismatch",
            content = @Content)
      })
  @PutMapping("/{employeeCompetencyId}")
  @ResponseStatus(HttpStatus.OK)
  public EmployeeCompetencyDto updateCompetency(
      @PathVariable Long employeeId,
      @PathVariable Long employeeCompetencyId,
      @Valid @RequestBody UpdateEmployeeCompetencyRequestDto request) {
    return employeeCompetencyService.updateCompetency(employeeId, employeeCompetencyId, request);
  }

  @Operation(
      summary = "Remove a competency from an employee",
      description =
          "Deletes the employee competency record. This will also cascade and delete any associated renewal plans.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "204",
            description = "Employee competency successfully deleted"),
        @ApiResponse(
            responseCode = "404",
            description = "EmployeeCompetency not found, or employee ID mismatch",
            content = @Content)
      })
  @DeleteMapping("/{employeeCompetencyId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCompetency(
      @PathVariable Long employeeId, @PathVariable Long employeeCompetencyId) {
    employeeCompetencyService.deleteCompetency(employeeId, employeeCompetencyId);
    return;
  }
}
