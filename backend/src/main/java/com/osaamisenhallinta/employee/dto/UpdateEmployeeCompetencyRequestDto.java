package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/** A request DTO for updating an employee's competency. */
public record UpdateEmployeeCompetencyRequestDto(@NotNull LocalDate issueDate) {}
