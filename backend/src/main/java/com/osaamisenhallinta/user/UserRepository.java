package com.osaamisenhallinta.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Database access for users. */
public interface UserRepository extends JpaRepository<User, Long> {

  /**
   * Retrieves an employee by their ID, or throws a NOT_FOUND exception if not found.
   *
   * @param employeeId the ID of the employee to retrieve
   * @return the employee with the specified ID
   * @throws ResponseStatusException if the employee is not found
   */
  default User getEmployeeByIdOrThrow(Long employeeId) {
    return findById(employeeId)
        .filter(user -> user.getRole() == UserRole.EMPLOYEE)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
  }

  Optional<User> findByEmail(String email);
}
