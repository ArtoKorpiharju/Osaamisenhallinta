package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;

/** DTO for assigning a qualification to an employee. */
public record AssignQualificationRequestDto(
    @NotNull(message = "Qualification ID is required") Long qualificationId) {}
