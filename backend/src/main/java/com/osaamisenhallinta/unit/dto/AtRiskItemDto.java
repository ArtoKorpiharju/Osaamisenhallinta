package com.osaamisenhallinta.unit.dto;

import com.osaamisenhallinta.competency.CompetencyStatus;
import java.time.LocalDate;

/** Represents a specific competency at risk that belongs to a critical qualification. */
public record AtRiskItemDto(
    Long employeeId,
    String employeeFirstName,
    String employeeLastName,
    Long qualificationId,
    String qualificationName,
    Long competencyId,
    String competencyName,
    LocalDate expirationDate,
    CompetencyStatus competencyStatus,
    LocalDate renewalDate) {}
