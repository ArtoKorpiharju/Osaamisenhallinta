package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.user.UserRole;
import java.util.List;

/** User information returned by the REST API. */
public record EmployeeOverviewDto(
    Long id,
    String firstName,
    String lastName,
    String email,
    UserRole role,
    List<EmployeeCompetencyDto> competencies,
    List<EmployeeQualificationDto> qualifications) {}
