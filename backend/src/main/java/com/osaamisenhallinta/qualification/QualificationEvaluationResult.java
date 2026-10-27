package com.osaamisenhallinta.qualification;

import java.time.LocalDate;
import java.util.List;

/** A record to hold the result of qualification evaluation. */
public record QualificationEvaluationResult(
    QualificationStatus status,
    LocalDate validUntil,
    int totalRequirementsCount,
    int metRequirementsCount,
    List<RequirementStatusDto> requirementStatuses) {}
