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

  /**
   * Maps an EmployeeQualification entity and its corresponding QualificationEvaluationResult to an
   * EmployeeQualificationDto.
   *
   * @param assignment The EmployeeQualification entity to convert.
   * @param qualificationEvaluationResult The result of evaluating the qualification.
   * @return An EmployeeQualificationDto containing the relevant data.
   */
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
