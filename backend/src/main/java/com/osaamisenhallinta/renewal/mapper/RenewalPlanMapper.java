package com.osaamisenhallinta.renewal.mapper;

import com.osaamisenhallinta.renewal.RenewalPlan;
import com.osaamisenhallinta.renewal.dto.RenewalPlanDto;

/** Mapper class for converting RenewalPlan entities to RenewalPlanDto objects. */
public class RenewalPlanMapper {

  private RenewalPlanMapper() {}

  /**
   * Maps a RenewalPlan entity to a RenewalPlanDto.
   *
   * @param plan The RenewalPlan entity to map.
   * @return The mapped RenewalPlanDto.
   */
  public static RenewalPlanDto mapToDto(RenewalPlan plan) {
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