package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/** A request DTO for adding an employee's competency. */
public record AddEmployeeCompetencyRequestDto(
    @NotNull Long competencyId, @NotNull LocalDate issueDate) {}
