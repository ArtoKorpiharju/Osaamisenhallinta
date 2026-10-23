package com.osaamisenhallinta.employee;

import static com.osaamisenhallinta.qualification.QualificationEvaluator.WARNING_DAYS_THRESHOLD;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyStatus;
import com.osaamisenhallinta.qualification.Qualification;
import com.osaamisenhallinta.qualification.QualificationEvaluationResult;
import com.osaamisenhallinta.qualification.QualificationEvaluator;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import com.osaamisenhallinta.user.UserRole;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Retrieves Employees and maps them to API responses. */
@Service
@Transactional(readOnly = true)
public class EmployeeService {
  private final UserRepository userRepository;
  private final QualificationEvaluator qualificationStatusCalculator;

  public EmployeeService(
      UserRepository userRepository, QualificationEvaluator qualificationStatusCalculator) {
    this.userRepository = userRepository;
    this.qualificationStatusCalculator = qualificationStatusCalculator;
  }

  /**
   * Returns an employee by their ID, or throws an exception if not found.
   *
   * @param id The ID of the employee to retrieve.
   * @return An EmployeeOverviewDto containing the employee's details.
   */
  public EmployeeOverviewDto getEmployeeById(Long id) {
    User employee = validateAndGetEmployee(id);

    return mapEmployeeOverviewToDto(employee);
  }

  private EmployeeOverviewDto mapEmployeeOverviewToDto(User employee) {
    LocalDate today = LocalDate.now();

    List<EmployeeCompetencyDto> employeeCompetenciesDto =
        employee.getEmployeeCompetencies().stream()
            .map(assignment -> mapEmployeeCompetencyToDto(assignment, today))
            .toList();

    List<EmployeeQualificationDto> employeeQualificationsDto =
        employee.getEmployeeQualifications().stream()
            .map(
                assignment ->
                    mapEmployeeQualificationToDto(assignment, employee.getEmployeeCompetencies()))
            .toList();

    return new EmployeeOverviewDto(
        employee.getId(),
        employee.getFirstName(),
        employee.getLastName(),
        employee.getEmail(),
        employee.getRole(),
        employeeCompetenciesDto,
        employeeQualificationsDto);
  }

  private EmployeeCompetencyDto mapEmployeeCompetencyToDto(
      EmployeeCompetency assignment, LocalDate today) {
    Competency competency = assignment.getCompetency();
    CompetencyStatus status = calculateCompetencyStatus(assignment.getExpirationDate(), today);

    return new EmployeeCompetencyDto(
        assignment.getId(),
        competency.getId(),
        competency.getName(),
        competency.getType(),
        assignment.getIssueDate(),
        assignment.getExpirationDate(),
        status);
  }

  private EmployeeQualificationDto mapEmployeeQualificationToDto(
      EmployeeQualification assignment, Set<EmployeeCompetency> employeeCompetencies) {
    Qualification qualification = assignment.getQualification();

    QualificationEvaluationResult qualificationEvaluationResult =
        qualificationStatusCalculator.evaluateQualification(
            qualification, List.copyOf(employeeCompetencies));

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

  private CompetencyStatus calculateCompetencyStatus(LocalDate expirationDate, LocalDate today) {
    if (expirationDate == null) {
      return CompetencyStatus.VALID;
    }
    if (expirationDate.isBefore(today)) {
      return CompetencyStatus.EXPIRED;
    }
    if (!expirationDate.isAfter(today.plusDays(WARNING_DAYS_THRESHOLD))) {
      return CompetencyStatus.EXPIRING_SOON;
    }
    return CompetencyStatus.VALID;
  }

  private User validateAndGetEmployee(Long employeeId) {
    return userRepository
        .findById(employeeId)
        .filter(user -> user.getRole() == UserRole.EMPLOYEE)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
  }
}
