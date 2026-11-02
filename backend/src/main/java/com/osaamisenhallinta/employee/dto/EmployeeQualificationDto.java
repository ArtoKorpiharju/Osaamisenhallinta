package com.osaamisenhallinta.employee.dto;

import com.osaamisenhallinta.qualification.QualificationStatus;
import java.time.LocalDate;
import java.util.List;

/** A data transfer object for representing an employee's qualification. */
public record EmployeeQualificationDto(
    Long employeeQualificationId,
    Long qualificationId,
    String qualificationName,
    boolean favourite,
    boolean critical,
    LocalDate validUntil,
    QualificationStatus status,
    int totalRequirementsCount,
    int metRequirementsCount,
    List<RequiredCompetencyDto> requiredCompetencies) {}
