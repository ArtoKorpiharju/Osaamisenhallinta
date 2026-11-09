package com.osaamisenhallinta.renewal.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/** A request DTO for creating or updating a renewal plan. */
public record RenewalPlanRequestDto(@NotNull LocalDate renewalDate, String renewalComment) {}
