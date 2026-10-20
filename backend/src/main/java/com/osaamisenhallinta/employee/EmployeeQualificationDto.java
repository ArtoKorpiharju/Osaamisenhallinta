package com.osaamisenhallinta.employee;

/** A data transfer object for representing an employee's qualification. */
public record EmployeeQualificationDto(
    Long employeeQualificationId,
    Long qualificationId,
    String qualificationName,
    boolean favourite,
    boolean critical) {}
