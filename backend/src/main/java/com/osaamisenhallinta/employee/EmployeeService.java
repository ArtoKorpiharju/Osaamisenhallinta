package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.qualification.Qualification;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Retrieves Employees and maps them to API responses. */
@Service
@Transactional(readOnly = true)
public class EmployeeService {
  private final UserRepository userRepository;

  public EmployeeService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /** Returns a user or reports that the user does not exist. */
  public EmployeeOverviewDto getEmployeeById(Long id) {
    User employee =
        userRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    EmployeeOverviewDto response = mapToDto(employee);
    return response;
  }

  private EmployeeOverviewDto mapToDto(User employee) {
    List<EmployeeCompetencyDto> competenciesDto =
        employee.getEmployeeCompetencies().stream()
            .map(
                assignment -> {
                  Competency competency = assignment.getCompetency();
                  return new EmployeeCompetencyDto(
                      assignment.getId(),
                      competency.getId(),
                      competency.getName(),
                      competency.getType(),
                      assignment.getIssueDate(),
                      assignment.getExpirationDate());
                })
            .toList();

    List<EmployeeQualificationDto> qualificationsDto =
        employee.getEmployeeQualifications().stream()
            .map(
                assignment -> {
                  Qualification qualification = assignment.getQualification();
                  return new EmployeeQualificationDto(
                      assignment.getId(),
                      qualification.getId(),
                      qualification.getName(),
                      assignment.isFavourite(),
                      assignment.isCritical());
                })
            .toList();

    return new EmployeeOverviewDto(
        employee.getId(),
        employee.getFirstName(),
        employee.getLastName(),
        employee.getEmail(),
        employee.getRole(),
        competenciesDto,
        qualificationsDto);
  }
}
