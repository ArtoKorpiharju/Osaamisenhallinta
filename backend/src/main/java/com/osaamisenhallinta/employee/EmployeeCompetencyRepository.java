package com.osaamisenhallinta.employee;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** A repository for managing employee competency data. */
public interface EmployeeCompetencyRepository extends JpaRepository<EmployeeCompetency, Long> {
  boolean existsByEmployeeIdAndCompetencyId(Long employeeId, Long competencyId);

  Optional<EmployeeCompetency> findByIdAndEmployeeId(Long id, Long employeeId);

  /**
   * Retrieves an employee competency by employee ID and employee's competency ID, or throws a
   * NOT_FOUND exception if not found.
   *
   * @param employeeId The ID of the employee.
   * @param empCompId The ID of the employee competency.
   * @return The employee competency.
   */
  default EmployeeCompetency getEmployeeCompetencyOrThrow(Long empCompId, Long employeeId) {
    return findByIdAndEmployeeId(empCompId, employeeId)
        .orElseThrow(
            () ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Employee's competency not found"));
  }
}
