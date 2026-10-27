package com.osaamisenhallinta.employee;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** A repository for managing employee competency data. */
public interface EmployeeCompetencyRepository extends JpaRepository<EmployeeCompetency, Long> {
  boolean existsByEmployeeIdAndCompetencyId(Long employeeId, Long competencyId);
  
  Optional<EmployeeCompetency> findByIdAndEmployeeId(Long id, Long employeeId);
}
