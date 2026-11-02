package com.osaamisenhallinta.qualification;

import com.osaamisenhallinta.employee.dto.RequiredCompetencyDto;
import java.time.LocalDate;
import java.util.List;

/** A record to hold the result of qualification evaluation. */
public record QualificationEvaluationResult(
    QualificationStatus status,
    LocalDate validUntil,
    int totalRequirementsCount,
    int metRequirementsCount,
    List<RequiredCompetencyDto> requirementStatuses) {}
