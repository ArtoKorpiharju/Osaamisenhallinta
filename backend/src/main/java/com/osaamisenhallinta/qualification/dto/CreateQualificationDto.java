package com.osaamisenhallinta.qualification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.hibernate.validator.constraints.UniqueElements;

/** A DTO for creating a qualification. */
public record CreateQualificationDto(
    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    String name,
    @NotEmpty(message = 
      "A qualification with no required competencies is not allowed")
    @UniqueElements(message = "Competency IDs must be unique")
    List<@NotNull(message = "Competency ID cannot be null") Long> requiredCompetenciesIds) {}