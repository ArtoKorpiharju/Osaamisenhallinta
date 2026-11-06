package com.osaamisenhallinta.competency;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** A DTO for creating a competency. */
public record CreateCompetencyDto(
    Long competencyId,
    @NotNull String name,
    @NotNull CompetencyType type,
    @Min(value = 1, message = "Validity months cannot be non-positive")
    Integer validityMonths) {}