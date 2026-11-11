package com.osaamisenhallinta.unit.dto;

import com.osaamisenhallinta.supervisor.dto.SupervisorSummaryDto;
import java.util.List;

/**
 * Represents an overview of a unit, including its details and associated employees and supervisors.
 */
public record UnitOverviewDto(
    Long unitId,
    String unitName,
    List<SupervisorSummaryDto> supervisors,
    List<UnitEmployeeSummaryDto> employees) {}
