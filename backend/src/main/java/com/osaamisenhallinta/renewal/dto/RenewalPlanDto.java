package com.osaamisenhallinta.renewal.dto;

import java.time.LocalDate;

/** A response DTO for creating or updating a renewal plan. */
public record RenewalPlanDto(
    Long id, Long employeeCompetencyId, LocalDate renewalDate, String renewalComment) {}
