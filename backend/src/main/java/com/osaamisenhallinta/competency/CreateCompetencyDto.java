package com.osaamisenhallinta.competency;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** A DTO for creating a competency. */
public record CreateCompetencyDto(
    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    String name,
    @NotNull CompetencyType type,
    @Min(value = 1, message = "Validity months cannot be non-positive")
    Integer validityMonths) {}