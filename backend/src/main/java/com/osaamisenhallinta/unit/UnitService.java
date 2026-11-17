package com.osaamisenhallinta.unit;

import com.osaamisenhallinta.employee.EmployeeCompetency;
import com.osaamisenhallinta.employee.EmployeeQualification;
import com.osaamisenhallinta.employee.EmployeeQualificationRepository;
import com.osaamisenhallinta.qualification.QualificationEvaluationResult;
import com.osaamisenhallinta.qualification.QualificationEvaluator;
import com.osaamisenhallinta.qualification.QualificationStatus;
import com.osaamisenhallinta.supervisor.dto.SupervisorSummaryDto;
import com.osaamisenhallinta.unit.dto.AtRiskItemDto;
import com.osaamisenhallinta.unit.dto.UnitEmployeeSummaryDto;
import com.osaamisenhallinta.unit.dto.UnitOverviewDto;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service for supervisor unit overview and risk tracking. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UnitService {

  private final UserRepository userRepository;
  private final EmployeeQualificationRepository employeeQualificationRepository;
  private final QualificationEvaluator qualificationEvaluator;
  private final UnitRepository unitRepository;

  /**
   * Returns a list of at-risk critical qualification items for employees in a specific unit.
   *
   * <p>It has a complexity of O(n*m*k), where n is the number of employees in the unit, m is the
   * number of qualifications per employee, and k is the number of competencies per qualification.
   * It should be fine for now at least. m and k tend to be small. Alternative could be to maintain
   * the statuses in the database instead of calculating them on the fly.
   *
   * @param unitId The ID of the unit to retrieve at-risk items for.
   * @return A list of at-risk critical qualification items.
   */
  @Transactional(readOnly = true)
  public List<AtRiskItemDto> getAtRiskCriticalQualificationItems(Long unitId) {
    // Simply verify that the unit exists.
    unitRepository.getByIdOrThrow(unitId);

    List<User> unitEmployees = userRepository.findAllByUnitIdWithDetails(unitId);
    if (unitEmployees.isEmpty()) {
      return new ArrayList<>();
    }

    LocalDate warningDate = LocalDate.now().plusDays(QualificationEvaluator.WARNING_DAYS_THRESHOLD);

    List<AtRiskItemDto> atRiskItems = new ArrayList<>();

    for (User employee : unitEmployees) {
      List<AtRiskItemDto> atRiskItemsForEmployee = findRisksForEmployee(employee, warningDate);
      atRiskItems.addAll(atRiskItemsForEmployee);
    }

    return atRiskItems;
  }

  /**
   * Returns an overview of a unit, including lists of its supervisors and employees.
   *
   * @param unitId The ID of the unit to retrieve the overview for.
   * @return A UnitOverviewDto containing the unit's supervisors and employee list.
   * @throws EntityNotFoundException if the unit does not exist.
   */
  @Transactional(readOnly = true)
  public UnitOverviewDto getUnitOverview(Long unitId) {
    Unit unit = unitRepository.getByIdOrThrow(unitId);

    List<User> unitEmployees = userRepository.findAllByUnitId(unitId);
    List<User> supervisors = userRepository.findSupervisorsByUnitId(unitId);

    List<UnitEmployeeSummaryDto> unitEmployeeSummaries = new ArrayList<>();
    for (User emp : unitEmployees) {
      unitEmployeeSummaries.add(
          new UnitEmployeeSummaryDto(emp.getId(), emp.getFirstName(), emp.getLastName()));
    }

    List<SupervisorSummaryDto> supervisorSummaries = new ArrayList<>();
    for (User sup : supervisors) {
      supervisorSummaries.add(
          new SupervisorSummaryDto(sup.getId(), sup.getFirstName(), sup.getLastName()));
    }

    return new UnitOverviewDto(unitId, unit.getName(), supervisorSummaries, unitEmployeeSummaries);
  }

  private List<AtRiskItemDto> findRisksForEmployee(User employee, LocalDate warningDate) {
    List<AtRiskItemDto> employeeRisks = new ArrayList<>();
    Set<EmployeeCompetency> empComps = employee.getEmployeeCompetencies();

    for (EmployeeQualification eq : employee.getEmployeeQualifications()) {
      if (!eq.isCritical()) {
        continue;
      }

      QualificationEvaluationResult result =
          qualificationEvaluator.evaluateQualification(eq.getQualification(), empComps);

      if (result.status() == QualificationStatus.QUALIFIED) {
        continue;
      }

      for (var req : result.requirementStatuses()) {
        boolean isMissingOrExpired =
            req.status() == com.osaamisenhallinta.competency.CompetencyStatus.MISSING
                || req.status() == com.osaamisenhallinta.competency.CompetencyStatus.EXPIRED;

        boolean isExpiringSoon =
            req.expirationDate() != null && !req.expirationDate().isAfter(warningDate);

        if (isMissingOrExpired || isExpiringSoon) {
          LocalDate scheduledRenewal =
              req.renewalPlan() != null ? req.renewalPlan().renewalDate() : null;

          employeeRisks.add(
              new AtRiskItemDto(
                  employee.getId(),
                  employee.getFirstName(),
                  employee.getLastName(),
                  eq.getQualification().getId(),
                  eq.getQualification().getName(),
                  req.competencyId(),
                  req.competencyName(),
                  req.expirationDate(),
                  req.status(),
                  scheduledRenewal));
        }
      }
    }
    return employeeRisks;
  }
}
