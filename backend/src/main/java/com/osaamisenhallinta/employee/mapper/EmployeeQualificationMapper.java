package com.osaamisenhallinta.employee.mapper;

import com.osaamisenhallinta.employee.EmployeeQualification;
import com.osaamisenhallinta.employee.dto.EmployeeQualificationDto;
import com.osaamisenhallinta.qualification.Qualification;
import com.osaamisenhallinta.qualification.QualificationEvaluationResult;

/**
 * Mapper class for converting EmployeeQualification entities to EmployeeQualificationDto objects.
 */
public class EmployeeQualificationMapper {

  private EmployeeQualificationMapper() {}

  public static EmployeeQualificationDto toEmployeeQualificationDto(
      EmployeeQualification assignment,
      QualificationEvaluationResult qualificationEvaluationResult) {
    Qualification qualification = assignment.getQualification();

    return new EmployeeQualificationDto(
        assignment.getId(),
        qualification.getId(),
        qualification.getName(),
        assignment.isFavourite(),
        assignment.isCritical(),
        qualificationEvaluationResult.validUntil(),
        qualificationEvaluationResult.status(),
        qualificationEvaluationResult.totalRequirementsCount(),
        qualificationEvaluationResult.metRequirementsCount(),
        qualificationEvaluationResult.requirementStatuses());
  }
}
