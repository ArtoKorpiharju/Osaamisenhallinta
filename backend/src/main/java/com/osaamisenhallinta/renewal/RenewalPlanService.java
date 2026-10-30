package com.osaamisenhallinta.renewal;

import com.osaamisenhallinta.employee.EmployeeCompetency;
import com.osaamisenhallinta.employee.EmployeeCompetencyService;
import com.osaamisenhallinta.renewal.dto.RenewalPlanDto;
import com.osaamisenhallinta.renewal.dto.RenewalPlanRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Service for managing renewal plans associated with employee competencies. */
@Service
@RequiredArgsConstructor
public class RenewalPlanService {
  private final EmployeeCompetencyService employeeCompetencyService;
  private final RenewalPlanRepository renewalPlanRepository;

  /**
   * Adds or updates a renewal plan for a specific employee competency depending on whether one
   * already exists.
   *
   * @param employeeId The ID of the employee.
   * @param empCompId The ID of the employee competency.
   * @param request The request DTO containing renewal plan details.
   * @return The created or updated renewal plan.
   * @throws ResponseStatusException NOT_FOUND if the employee competency is not found.
   */
  @Transactional
  public RenewalPlanDto addOrUpdateRenewalPlan(
      Long employeeId, Long empCompId, RenewalPlanRequestDto request) {

    EmployeeCompetency empComp =
        employeeCompetencyService.getEmployeeCompetencyOrThrow(empCompId, employeeId);

    RenewalPlan existingPlan = empComp.getRenewalPlan();

    if (existingPlan == null) {
      RenewalPlan newPlan = new RenewalPlan(request.renewalDate(), request.renewalComment());
      empComp.setRenewalPlan(newPlan);
      newPlan = renewalPlanRepository.save(newPlan);
      return mapToRenewalPlanDto(newPlan);
    } else {
      existingPlan.update(request.renewalDate(), request.renewalComment());
      return mapToRenewalPlanDto(existingPlan);
    }
  }

  /**
   * Deletes the renewal plan associated with a specific employee competency.
   *
   * @param employeeId The ID of the employee.
   * @param empCompId The ID of the employee competency.
   * @throws ResponseStatusException NOT_FOUND if the employee competency is not found.
   */
  @Transactional
  public void deleteRenewalPlan(Long employeeId, Long empCompId) {
    EmployeeCompetency empComp =
        employeeCompetencyService.getEmployeeCompetencyOrThrow(empCompId, employeeId);
    RenewalPlan existingPlan = empComp.getRenewalPlan();

    if (existingPlan != null) {
      empComp.removeRenewalPlan();

      renewalPlanRepository.delete(existingPlan);
    }
    return;
  }

  private RenewalPlanDto mapToRenewalPlanDto(RenewalPlan plan) {
    return new RenewalPlanDto(
        plan.getId(),
        plan.getEmployeeCompetency().getId(),
        plan.getRenewalDate(),
        plan.getRenewalComment());
  }
}
