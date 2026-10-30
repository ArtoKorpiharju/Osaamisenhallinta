package com.osaamisenhallinta.renewal;

import com.osaamisenhallinta.renewal.dto.RenewalPlanDto;
import com.osaamisenhallinta.renewal.dto.RenewalPlanRequestDto;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Controller for managing renewal plans. */
@RestController
@RequestMapping("/api/employees/{employeeId}/competencies/{employeeCompetencyId}/renewal-plan")
@RequiredArgsConstructor
@Tag(
    name = "Renewal Plans",
    description = "Endpoints for managing employee competency renewal plans")
public class RenewalPlanController {

  private final RenewalPlanService renewalPlanService;

  @PutMapping
  @ResponseStatus(HttpStatus.OK)
  @Operation(
      summary = "Create or update a renewal plan",
      description =
          "Adds a new renewal plan if one does not exist, or updates an existing one for a specific employee competency. Acts as an upsert.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Renewal plan successfully created or updated"),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request body",
            content = @Content),
        @ApiResponse(
            responseCode = "404",
            description = "Employee or EmployeeCompetency not found, or ID mismatch",
            content = @Content)
      })
  public RenewalPlanDto createOrUpdateRenewalPlan(
      @PathVariable Long employeeId,
      @PathVariable Long employeeCompetencyId,
      @Valid @RequestBody RenewalPlanRequestDto request) {
    return renewalPlanService.addOrUpdateRenewalPlan(employeeId, employeeCompetencyId, request);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(
      summary = "Delete a renewal plan",
      description = "Deletes the renewal plan associated with a specific employee competency.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Renewal plan successfully deleted"),
        @ApiResponse(
            responseCode = "404",
            description = "Employee or EmployeeCompetency not found, or ID mismatch",
            content = @Content)
      })
  public void deleteRenewalPlan(@PathVariable Long employeeId, @PathVariable Long employeeCompetencyId) {
    renewalPlanService.deleteRenewalPlan(employeeId, employeeCompetencyId);
    return;
  }
}
