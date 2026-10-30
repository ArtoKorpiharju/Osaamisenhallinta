package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyRepository;
import com.osaamisenhallinta.employee.dto.AddEmployeeCompetencyRequestDto;
import com.osaamisenhallinta.employee.dto.EmployeeCompetencyDto;
import com.osaamisenhallinta.employee.dto.UpdateEmployeeCompetencyRequestDto;
import com.osaamisenhallinta.employee.mapper.EmployeeCompetencyMapper;
import com.osaamisenhallinta.renewal.RenewalPlanRepository;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Service for managing employee competency data. */
@Service
@RequiredArgsConstructor
public class EmployeeCompetencyService {

  private final EmployeeCompetencyRepository employeeCompetencyRepository;
  private final UserRepository userRepository;
  private final CompetencyRepository competencyRepository;
  private final RenewalPlanRepository renewalPlanRepository;

  private static final String EMP_COMP_NOT_FOUND_MESSAGE = "Employee's competency not found";

  /**
   * Adds a new competency to an employee.
   *
   * @param employeeId The ID of the employee.
   * @param request The request DTO containing competency details.
   * @return The created employee competency.
   * @throws ResponseStatusException if the employee is not found.
   */
  @Transactional
  public EmployeeCompetencyDto addCompetency(
      Long employeeId, AddEmployeeCompetencyRequestDto request) {

    if (employeeCompetencyRepository.existsByEmployeeIdAndCompetencyId(
        employeeId, request.competencyId())) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Employee already has this competency");
    }

    User employee = userRepository.getEmployeeByIdOrThrow(employeeId);
    Competency competencyToBeAdded =
        competencyRepository
            .findById(request.competencyId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Competency not found"));
    LocalDate newExpirationDate =
        calculateCompetencyExpirationDate(competencyToBeAdded, request.issueDate());
    EmployeeCompetency newEmployeeCompetency =
        new EmployeeCompetency(
            employee, competencyToBeAdded, request.issueDate(), newExpirationDate);
    newEmployeeCompetency = employeeCompetencyRepository.save(newEmployeeCompetency);
    return EmployeeCompetencyMapper.mapToDto(newEmployeeCompetency);
  }

  /**
   * Updates an existing employee competency.
   *
   * @param employeeId The ID of the employee.
   * @param empCompId The ID of the employee competency to update.
   * @param request The request DTO containing updated competency details.
   * @return The updated employee competency.
   */
  @Transactional
  public EmployeeCompetencyDto updateCompetency(
      Long employeeId, Long empCompId, UpdateEmployeeCompetencyRequestDto request) {
    EmployeeCompetency empComp = getEmployeeCompetencyOrThrow(empCompId, employeeId);

    LocalDate newIssueDate = request.issueDate();
    LocalDate newExpirationDate =
        calculateCompetencyExpirationDate(empComp.getCompetency(), newIssueDate);

    empComp.updateIssueAndExpirationDates(request.issueDate(), newExpirationDate);
    return EmployeeCompetencyMapper.mapToDto(empComp);
  }

  /**
   * Deletes an employee competency.
   *
   * @param employeeId The ID of the employee.
   * @param empCompId The ID of the employee competency to delete.
   */
  @Transactional
  public void deleteCompetency(Long employeeId, Long empCompId) {
    EmployeeCompetency empComp = getEmployeeCompetencyOrThrow(empCompId, employeeId);

    if (empComp.getRenewalPlan() != null) {
      renewalPlanRepository.delete(empComp.getRenewalPlan());
      empComp.setRenewalPlan(null);
    }

    employeeCompetencyRepository.delete(empComp);
  }

  /**
   * Retrieves an employee competency by employee ID and employee's competency ID, or throws a
   * NOT_FOUND exception if not found.
   *
   * @param employeeId The ID of the employee.
   * @param empCompId The ID of the employee competency.
   * @return The employee competency.
   */
  public EmployeeCompetency getEmployeeCompetencyOrThrow(Long empCompId, Long employeeId) {
    return employeeCompetencyRepository
        .findByIdAndEmployeeId(empCompId, employeeId)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, EMP_COMP_NOT_FOUND_MESSAGE));
  }

  private LocalDate calculateCompetencyExpirationDate(Competency competency, LocalDate issueDate) {
    Integer validityMonths = competency.getValidityMonths();
    LocalDate expirationDate = null;
    if (validityMonths == null) {
      return expirationDate; // No expiration
    }
    expirationDate = issueDate.plusMonths(validityMonths);
    return expirationDate;
  }
}
