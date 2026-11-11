package com.osaamisenhallinta.qualification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

/** A DTO for creating a qualification. */
public record CreateQualificationDto(
    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    String name,
    @NotEmpty(message = 
      "A qualification with no required competencies is not allowed.")
    List<Long> requiredCompetenciesIds) {}