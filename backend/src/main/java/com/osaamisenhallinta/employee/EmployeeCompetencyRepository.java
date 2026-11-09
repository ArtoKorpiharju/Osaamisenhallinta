package com.osaamisenhallinta.employee;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


/** A repository for managing employee competency data. */
public interface EmployeeCompetencyRepository extends JpaRepository<EmployeeCompetency, Long> {
  boolean existsByEmployeeIdAndCompetencyId(Long employeeId, Long competencyId);

  Optional<EmployeeCompetency> findByIdAndEmployeeId(Long id, Long employeeId);

  List<EmployeeCompetency> findByCompetencyId(Long competencyId);

  @Modifying
  @Query("DELETE FROM EmployeeCompetency e WHERE e.competency.id = :competencyId") 
  void deleteByCompetencyId(@Param("competencyId") Long competencyId);
}
