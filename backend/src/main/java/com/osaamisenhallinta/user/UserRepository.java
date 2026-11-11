package com.osaamisenhallinta.user;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.server.ResponseStatusException;

/** Database access for users. */
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  /**
   * Fetches all employees belonging to a specific unit, also fetching their qualifications and
   * competencies.
   *
   * <p>FIX? This uses multiple JOIN FETCHes which creates a Cartesian product. For the MVP this is
   * fine, but consider changing if performance becomes an issue.
   */
  @Query(
      """
      SELECT DISTINCT u FROM User u
      JOIN u.units unit
      LEFT JOIN FETCH u.employeeQualifications
      LEFT JOIN FETCH u.employeeCompetencies
      WHERE unit.id = :unitId
      """)
  List<User> findAllByUnitIdWithDetails(@Param("unitId") Long unitId);

  /** Fetches all employees belonging to a specific unit. */
  @Query("SELECT DISTINCT u FROM User u JOIN u.units unit WHERE unit.id = :unitId")
  List<User> findAllByUnitId(@Param("unitId") Long unitId);

  /** Fetches all supervisors assigned to manage a specific unit. */
  @Query("SELECT u FROM User u WHERE u.supervisedUnit.id = :unitId")
  List<User> findSupervisorsByUnitId(@Param("unitId") Long unitId);

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
        .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
  }
}
