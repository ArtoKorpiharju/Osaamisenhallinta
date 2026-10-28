package com.osaamisenhallinta.qualification;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.employee.EmployeeCompetency;
import com.osaamisenhallinta.qualification.dto.RequirementStatusDto;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;

/** Service for calculating the status of a qualification based on an employee's competencies. */
@Service
public class QualificationEvaluator {

  // This is the threshold in days for when a competency or qualification is considered to be
  // "expiring". Feel free to adjust as needed.
  public static final int WARNING_DAYS_THRESHOLD = 30;
  private static final int ZERO_REQUIREMENTS = 0;

  /**
   * Calculates several data about a qualification of an employee based on the their competencies.
   * Qualification status (QUALIFIED, EXPIRING_SOON, NOT_QUALIFIED) is determined based on the
   * employee's competencies and their expiration dates. The validUntil date is the earliest
   * expiration date of the required competencies. The totalRequirementsCount is the number of
   * required competencies for the qualification, and the metRequirementsCount is the number of
   * those requirements that the employee currently meets.
   *
   * <p>The complexity is O(M * N) where M is the number of required competencies and N is the
   * number of employee competencies. Because M is small (and also generally N is small), this is
   * efficient enough.
   *
   * @param qualification The qualification to evaluate.
   * @param employeeCompetencies The list of competencies the employee currently possesses.
   * @return The calculated QualificationEvaluationResult containing the status, valid until date,
   *     and counts of total and met requirements.
   */
  public QualificationEvaluationResult evaluateQualification(
      Qualification qualification, List<EmployeeCompetency> employeeCompetencies) {

    Set<Competency> requiredCompetencies = qualification.getRequiredCompetencies();
    int metRequirementsCount = 0;
    LocalDate earliestExpiration = null;
    boolean expiringSoon = false;
    boolean allRequirementsMet = false;
    QualificationStatus qualificationStatus = QualificationStatus.NOT_QUALIFIED;
    List<RequirementStatusDto> requirementStatuses = new ArrayList<>();

    if (requiredCompetencies == null || requiredCompetencies.isEmpty()) {
      return new QualificationEvaluationResult(
          QualificationStatus.QUALIFIED, null, ZERO_REQUIREMENTS, metRequirementsCount, List.of());
    }

    int totalRequirementsCount = requiredCompetencies.size();
    LocalDate today = LocalDate.now();
    LocalDate warningDate = today.plusDays(WARNING_DAYS_THRESHOLD);

    // Filter out expired competencies.
    List<EmployeeCompetency> activeEmployeeCompetencies =
        employeeCompetencies.stream()
            .filter(ec -> ec.getExpirationDate() == null || !ec.getExpirationDate().isBefore(today))
            .toList();

    // Loop through each required competency and check if the employee has it and if it's expiring
    // soon.
    for (Competency required : requiredCompetencies) {
      Long requiredId = required.getId();
      LocalDate expDate = null;

      Optional<EmployeeCompetency> match =
          activeEmployeeCompetencies.stream()
              .filter(uc -> uc.getCompetency().getId().equals(requiredId))
              .findFirst();

      boolean isMet = match.isPresent();

      if (isMet) {
        expDate = match.get().getExpirationDate();
        metRequirementsCount++;
      }

      requirementStatuses.add(
          new RequirementStatusDto(
              requiredId, required.getName(), required.getType(), isMet, expDate));

      if (!isMet) {
        continue;
      }

      // Competency is valid indefinitely, no need to check further.
      if (expDate == null) {
        continue;
      }

      // Update the earliest expiration date if needed.
      if (earliestExpiration == null || expDate.isBefore(earliestExpiration)) {
        earliestExpiration = expDate;
      }
    }

    // Use isAfter instead of isBefore to include the warning date itself in the "expiring soon"
    // category.
    if (earliestExpiration != null && !earliestExpiration.isAfter(warningDate)) {
      expiringSoon = true;
    }

    if (totalRequirementsCount == metRequirementsCount) {
      allRequirementsMet = true;
    }

    if (allRequirementsMet) {
      if (expiringSoon) {
        qualificationStatus = QualificationStatus.EXPIRING_SOON;
      } else {
        qualificationStatus = QualificationStatus.QUALIFIED;
      }

    } else {
      qualificationStatus = QualificationStatus.NOT_QUALIFIED;
    }
    return new QualificationEvaluationResult(
        qualificationStatus,
        earliestExpiration,
        totalRequirementsCount,
        metRequirementsCount,
        requirementStatuses);
  }
}
