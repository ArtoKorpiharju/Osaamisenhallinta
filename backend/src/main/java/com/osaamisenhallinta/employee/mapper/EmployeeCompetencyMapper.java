package com.osaamisenhallinta.employee.mapper;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.employee.EmployeeCompetency;
import com.osaamisenhallinta.employee.dto.EmployeeCompetencyDto;
import com.osaamisenhallinta.renewal.RenewalPlan;
import com.osaamisenhallinta.renewal.dto.RenewalPlanDto;

/** Mapper class for converting EmployeeCompetency entities to EmployeeCompetencyDto objects. */
public class EmployeeCompetencyMapper {

  private EmployeeCompetencyMapper() {}

  /**
   * Maps an EmployeeCompetency entity to an EmployeeCompetencyDto.
   *
   * @param entity The EmployeeCompetency entity to map.
   * @return The mapped EmployeeCompetencyDto.
   */
  public static EmployeeCompetencyDto mapToDto(EmployeeCompetency entity) {
    Competency competency = entity.getCompetency();
    return new EmployeeCompetencyDto(
        entity.getId(),
        competency.getId(),
        competency.getName(),
        competency.getType(),
        entity.getIssueDate(),
        entity.getExpirationDate(),
        entity.getStatus(),
        mapToRenewalPlanDto(entity.getRenewalPlan()));
  }

  private static RenewalPlanDto mapToRenewalPlanDto(RenewalPlan plan) {
    if (plan == null) {
      return null;
    }
    return new RenewalPlanDto(
        plan.getId(),
        plan.getEmployeeCompetency().getId(),
        plan.getRenewalDate(),
        plan.getRenewalComment());
  }
}
