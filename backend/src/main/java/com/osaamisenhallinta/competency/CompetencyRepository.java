package com.osaamisenhallinta.competency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** A repository for managing global competency data. */
public interface CompetencyRepository extends JpaRepository<Competency, Long> {
  @Query("SELECT COUNT(q) > 0 FROM Competency c JOIN c.qualifications q WHERE c.id = :id")
  boolean isUsedByQualification(@Param("id") Long id);

  boolean existsByName(String name);
}
