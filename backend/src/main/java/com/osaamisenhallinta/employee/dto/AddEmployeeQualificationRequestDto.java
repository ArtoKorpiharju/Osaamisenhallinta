package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;

/** A request DTO for adding a qualification to an employee. */
public record AddEmployeeQualificationRequestDto(
    @NotNull Long qualificationId, boolean isCritical) {}
