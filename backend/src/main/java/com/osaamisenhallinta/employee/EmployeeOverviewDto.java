package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.user.UserRole;

/** User information returned by the REST API. */
public record EmployeeOverviewDto(
    Long id,
    String firstName,
    String lastName,
    String email,
    UserRole role,
    String[] credentials,
    String[] qualifications) {
}
