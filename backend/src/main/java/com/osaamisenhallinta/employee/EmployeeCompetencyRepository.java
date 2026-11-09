package com.osaamisenhallinta.employee;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** A repository for managing employee competency data. */
public interface EmployeeCompetencyRepository extends JpaRepository<EmployeeCompetency, Long> {
  boolean existsByEmployeeIdAndCompetencyId(Long employeeId, Long competencyId);

  Optional<EmployeeCompetency> findByIdAndEmployeeId(Long id, Long employeeId);

  List<EmployeeCompetency> findByCompetencyId(Long competencyId);

  @Modifying
  @Query("DELETE FROM EmployeeCompetency e WHERE e.competency.id = :competencyId")
  void deleteByCompetencyId(@Param("competencyId") Long competencyId);

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
