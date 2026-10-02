package com.osaamisenhallinta.backend.employee;

import com.osaamisenhallinta.backend.user.User;
import com.osaamisenhallinta.backend.user.UserRepository;
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
    User employee = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    EmployeeOverviewDto response = mapToDto(employee);
    return response;
  }

  private EmployeeOverviewDto mapToDto(User employee) {
    // Placeholder for actual credentials
    String[] credentials = {"credential1", "credential2"};
    // Placeholder for actual qualifications
    String[] qualifications = {"qualification1", "qualification2"};
    return new EmployeeOverviewDto(employee.getId(), employee.getFirstName(),
        employee.getLastName(), employee.getEmail(), employee.getRole(), credentials,
        qualifications);
  }
}
