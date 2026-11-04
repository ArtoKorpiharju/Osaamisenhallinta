package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.employee.dto.EmployeeCompetencyDto;
import com.osaamisenhallinta.employee.dto.EmployeeOverviewDto;
import com.osaamisenhallinta.employee.dto.EmployeeQualificationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for employee information. */
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
  private final EmployeeService employeeService;

  public EmployeeController(EmployeeService employeeService) {
    this.employeeService = employeeService;
  }

  @Operation(summary = "Get employee overview by ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successful operation"),
        @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
        @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content),
      })
  @GetMapping({"/{id}/overview"})
  public EmployeeOverviewDto getEmployeeById(@PathVariable Long id) {
    return employeeService.getEmployeeById(id);
  }

  @Operation(summary = "Get all qualifications for an employee")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successful operation"),
        @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
        @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content),
      })
  @GetMapping("/{id}/qualifications")
  public List<EmployeeQualificationDto> getEmployeeQualifications(@PathVariable Long id) {
    return employeeService.getEmployeeQualifications(id);
  }

  @Operation(summary = "Get all competencies for an employee")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successful operation"),
        @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
        @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content),
      })
  @GetMapping("/{id}/competencies")
  public List<EmployeeCompetencyDto> getEmployeeCompetencies(@PathVariable Long id) {
    return employeeService.getEmployeeCompetencies(id);
  }
}
