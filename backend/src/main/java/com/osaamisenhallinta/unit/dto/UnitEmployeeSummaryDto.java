package com.osaamisenhallinta.unit.dto;

/** Represents an employee (table row) summary in the unit. */
public record UnitEmployeeSummaryDto(
    Long employeeId, String employeeFirstName, String employeeLastName) {}
