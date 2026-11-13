package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;

/** A DTO for updating the favourite status of an employee's assigned qualification. */
public record UpdateFavouriteRequestDto(@NotNull Boolean favourite) {}
