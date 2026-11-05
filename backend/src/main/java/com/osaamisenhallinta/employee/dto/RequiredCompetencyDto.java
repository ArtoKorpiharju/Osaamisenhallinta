package com.osaamisenhallinta.employee.dto;

import com.osaamisenhallinta.competency.CompetencyStatus;
import com.osaamisenhallinta.renewal.dto.RenewalPlanDto;
import java.time.LocalDate;

/** A required competency and its status for an employee. */
public record RequiredCompetencyDto(
    Long competencyId,
    String competencyName,
    CompetencyStatus status,
    LocalDate expirationDate,
    RenewalPlanDto renewalPlan) {}
