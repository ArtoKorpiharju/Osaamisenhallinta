package com.osaamisenhallinta.qualification.dto;

import com.osaamisenhallinta.competency.CompetencyType;
import java.time.LocalDate;

/**
 * A data transfer object for representing a requirement (competency) within a qualification (for an
 * employee). Not to mix with EmployeeCompetencyDto, which represents a competency that an employee
 * has.
 */
public record RequirementStatusDto(
    Long competencyId,
    String competencyName,
    CompetencyType competencyType,
    boolean isMet,
    LocalDate expirationDate) {}
