package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateEmployeeQualificationIsCriticalRequestDto(
    @NotNull(message = "isCritical flag cannot be null") Boolean isCritical) {}
