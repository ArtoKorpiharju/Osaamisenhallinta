package com.osaamisenhallinta.employee.dto;

import jakarta.validation.constraints.NotNull;

/** A request DTO for assigning a qualification to an employee. */
public record AssignQualificationRequestDto(@NotNull Long qualificationId, Boolean isCritical) {

  /**
   * A constructor that defines the default value for isCritical as false if it is not provided in
   * the request.
   */
  public AssignQualificationRequestDto {
    if (isCritical == null) {
      isCritical = false;
    }
  }
}
