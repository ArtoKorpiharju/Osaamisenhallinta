package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.employee.dto.AssignQualificationRequestDto;
import com.osaamisenhallinta.employee.dto.EmployeeQualificationDto;
import com.osaamisenhallinta.employee.dto.UpdateFavouriteRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** A controller for managing REST API endpoints for employee qualifications. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees/{employeeId}/qualifications")
@Tag(
    name = "Employee Qualifications",
    description = "Endpoints for managing qualifications assigned to specific employees")
public class EmployeeQualificationController {

  private final EmployeeQualificationService employeeQualificationService;

  @Operation(
      summary = "Assign a qualification",
      description = "Assigns an existing global qualification to an employee's profile.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "201", description = "Qualification assigned successfully"),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request payload",
            content = @Content),
        @ApiResponse(
            responseCode = "404",
            description = "Employee or Qualification not found",
            content = @Content),
        @ApiResponse(
            responseCode = "409",
            description = "Employee already holds this qualification",
            content = @Content)
      })
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EmployeeQualificationDto assignQualification(
      @PathVariable Long employeeId, @Valid @RequestBody AssignQualificationRequestDto requestDto) {
    return employeeQualificationService.assignQualification(
        employeeId, requestDto.qualificationId());
  }

  @Operation(
      summary = "Remove an assigned qualification",
      description =
          "Removes a qualification from an employee's profile. Critical qualifications cannot be deleted.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Qualification removed successfully"),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden: Cannot remove a critical qualification",
            content = @Content),
        @ApiResponse(
            responseCode = "404",
            description = "Employee qualification assignment not found",
            content = @Content),
      })
  @DeleteMapping("/{employeeQualificationId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeQualification(
      @PathVariable Long employeeId, @PathVariable Long employeeQualificationId) {
    employeeQualificationService.removeQualification(employeeId, employeeQualificationId);
    return;
  }

  @Operation(
      summary = "Toggle favourite status",
      description = "Toggles the favourite boolean flag for an employee's assigned qualification.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Favourite status updated successfully"),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request payload",
            content = @Content),
        @ApiResponse(
            responseCode = "404",
            description = "Employee qualification assignment not found",
            content = @Content)
      })
  @PatchMapping("/{employeeQualificationId}/favourite")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void toggleQualificationFavourite(
      @PathVariable Long employeeId,
      @PathVariable Long employeeQualificationId,
      @Valid @RequestBody UpdateFavouriteRequestDto requestDto) {
    employeeQualificationService.toggleQualificationFavourite(
        employeeId, employeeQualificationId, requestDto.favourite());
    return;
  }
}
