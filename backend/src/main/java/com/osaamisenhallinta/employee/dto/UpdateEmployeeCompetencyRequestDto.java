package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

/** A request DTO for updating an employee's competency. */
public record UpdateEmployeeCompetencyRequestDto(
    @NotNull(message = "Issue date is required")
        @PastOrPresent(message = "Issue date cannot be in the future")
        LocalDate issueDate) {}
