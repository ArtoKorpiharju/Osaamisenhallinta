package com.osaamisenhallinta.competency.dto;

import com.osaamisenhallinta.competency.CompetencyType;

/** A data transfer object for representing a competency. */
public record CompetencyDto(
    Long competencyId,
    String competencyName,
    CompetencyType competencyType,
    Integer validityMonths) {}
