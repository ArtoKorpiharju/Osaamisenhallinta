package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.employee.dto.EmployeeCompetencyDto;
import com.osaamisenhallinta.employee.dto.EmployeeOverviewDto;
import com.osaamisenhallinta.employee.dto.EmployeeQualificationDto;
import com.osaamisenhallinta.employee.mapper.EmployeeCompetencyMapper;
import com.osaamisenhallinta.employee.mapper.EmployeeQualificationMapper;
import com.osaamisenhallinta.qualification.QualificationEvaluationResult;
import com.osaamisenhallinta.qualification.QualificationEvaluator;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import java.util.Collection;
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
  private final QualificationEvaluator qualificationEvaluator;

  public EmployeeService(
      UserRepository userRepository, QualificationEvaluator qualificationEvaluator) {
    this.userRepository = userRepository;
    this.qualificationEvaluator = qualificationEvaluator;
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

    // To save development time, filter is done here in service. If needed in future, filter in
    // repository instead to increase performace.
    List<EmployeeQualification> dashboardQualifications =
        employee.getEmployeeQualifications().stream()
            .filter(q -> q.isCritical() || q.isFavourite())
            .toList();

    List<EmployeeCompetency> employeeCompetencies = List.copyOf(employee.getEmployeeCompetencies());

    return mapEmployeeOverviewToDto(employee, dashboardQualifications, employeeCompetencies);
  }

  /**
   * Returns a list of qualifications for an employee by their ID.
   *
   * @param id The ID of the employee whose qualifications are to be retrieved.
   * @return A list of EmployeeQualificationDto containing the employee's qualifications.
   * @throws ResponseStatusException if the employee is not found.
   */
  public List<EmployeeQualificationDto> getEmployeeQualifications(Long id) {
    User employee = userRepository.getEmployeeByIdOrThrow(id);
    Set<EmployeeQualification> employeeQualifications = employee.getEmployeeQualifications();
    Set<EmployeeCompetency> employeeCompetencies = employee.getEmployeeCompetencies();
    return mapEmployeeQualificationsToDto(employeeQualifications, employeeCompetencies);
  }

  /**
   * Returns a list of competencies for an employee by their ID.
   *
   * @param id The ID of the employee whose competencies are to be retrieved.
   * @return A list of EmployeeCompetencyDto containing the employee's competencies.
   * @throws ResponseStatusException if the employee is not found.
   */
  public List<EmployeeCompetencyDto> getEmployeeCompetencies(Long id) {
    User employee = userRepository.getEmployeeByIdOrThrow(id);
    return employee.getEmployeeCompetencies().stream()
        .map(EmployeeCompetencyMapper::mapToDto)
        .toList();
  }

  private EmployeeOverviewDto mapEmployeeOverviewToDto(
      User employee,
      List<EmployeeQualification> dashboardQualifications,
      List<EmployeeCompetency> employeeCompetencies) {
    return new EmployeeOverviewDto(
        employee.getId(),
        employee.getFirstName(),
        employee.getLastName(),
        employee.getEmail(),
        employee.getRole(),
        mapEmployeeQualificationsToDto(dashboardQualifications, employeeCompetencies));
  }

  private List<EmployeeQualificationDto> mapEmployeeQualificationsToDto(
      Collection<EmployeeQualification> qualifications,
      Collection<EmployeeCompetency> competencies) {

    return qualifications.stream()
        .map(
            assignment -> {
              QualificationEvaluationResult result =
                  qualificationEvaluator.evaluateQualification(
                      assignment.getQualification(), competencies);

              return EmployeeQualificationMapper.toEmployeeQualificationDto(assignment, result);
            })
        .toList();
  }
}
