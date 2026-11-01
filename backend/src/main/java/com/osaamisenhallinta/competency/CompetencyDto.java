package com.osaamisenhallinta.competency;

// import com.osaamisenhallinta.competency.CompetencyType;

/** A data transfer object for representing a competency. */
public record CompetencyDto(
    Long competencyId,
    String competencyName,
    String competencyType, // string for now?
    Integer validityMonths) {}
