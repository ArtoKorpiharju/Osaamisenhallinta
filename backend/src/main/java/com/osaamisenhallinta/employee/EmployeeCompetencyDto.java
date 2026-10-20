package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.competency.CompetencyType;
import java.time.LocalDate;

/** A data transfer object for representing an employee's competency. */
public record EmployeeCompetencyDto(
    Long employeeCompetencyId,
    Long competencyId,
    String competencyName,
    CompetencyType competencyType,
    LocalDate issueDate,
    LocalDate expirationDate) {}
