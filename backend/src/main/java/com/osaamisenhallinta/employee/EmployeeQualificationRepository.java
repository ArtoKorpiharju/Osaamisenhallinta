package com.osaamisenhallinta.employee;

import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Database access for employee qualifications. */
public interface EmployeeQualificationRepository
    extends JpaRepository<EmployeeQualification, Long> {

  boolean existsByEmployeeIdAndQualificationId(Long employeeId, Long qualificationId);

  Optional<EmployeeQualification> findByEmployeeIdAndId(
      Long employeeId, Long employeeQualificationId);

  /**
   * Fetches an employee qualification by ID and employee ID, or throws an exception if not found.
   */
  default EmployeeQualification getByEmployeeIdAndEmployeeQualificationIdOrThrow(
      Long employeeId, Long employeeQualificationId) {
    return findByEmployeeIdAndId(employeeId, employeeQualificationId)
        .orElseThrow(
            () ->
                new EntityNotFoundException(
                    "Qualification assignment not found with id: "
                        + employeeQualificationId
                        + " for employee: "
                        + employeeId));
  }
}
