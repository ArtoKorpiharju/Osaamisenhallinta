package com.osaamisenhallinta.qualification.dto;

import com.osaamisenhallinta.competency.dto.CompetencyDto;
import java.util.List;

/** A data transfer object for representing a qualification. */
public record QualificationDto(
    Long qualificationId, 
    String qualificationName, 
    List<CompetencyDto> requiredCompetencies) {}
