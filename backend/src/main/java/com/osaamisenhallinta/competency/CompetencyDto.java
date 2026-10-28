package com.osaamisenhallinta.competency;

/** A data transfer object for representing a competency. */
public record CompetencyDto(
    Long competencyId,
    String competencyName,
    CompetencyType competencyType,
    Long validityMonths) {}
