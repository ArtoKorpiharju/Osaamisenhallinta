package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.employee.dto.EmployeeCompetencyDto;
import com.osaamisenhallinta.employee.dto.EmployeeOverviewDto;
import com.osaamisenhallinta.employee.dto.EmployeeQualificationDto;
import com.osaamisenhallinta.employee.mapper.EmployeeCompetencyMapper;
import com.osaamisenhallinta.qualification.Qualification;
import com.osaamisenhallinta.qualification.QualificationEvaluationResult;
import com.osaamisenhallinta.qualification.QualificationEvaluator;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import java.util.List;
import java.util.Set;
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
   * @throws ResponseStatusException if the employee is not found.
   */
  public EmployeeOverviewDto getEmployeeById(Long id) {
    User employee = userRepository.getEmployeeByIdOrThrow(id);

    return mapEmployeeOverviewToDto(employee);
  }

  private EmployeeOverviewDto mapEmployeeOverviewToDto(User employee) {
    List<EmployeeCompetencyDto> employeeCompetenciesDto =
        employee.getEmployeeCompetencies().stream()
            .map(assignment -> EmployeeCompetencyMapper.mapToDto(assignment))
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
}
