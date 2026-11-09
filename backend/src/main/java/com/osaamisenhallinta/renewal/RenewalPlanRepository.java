package com.osaamisenhallinta.renewal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Repository for managing RenewalPlan entities. */
public interface RenewalPlanRepository extends JpaRepository<RenewalPlan, Long> {
  @Modifying
  @Query(
      """
      DELETE from RenewalPlan rp
      WHERE rp.employeeCompetency.competency.id = :competencyId
      """)
  void deleteByCompetencyId(@Param("competencyId") Long competencyId);
}
