package com.osaamisenhallinta.competency;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** A repository for managing global competency data. */
public interface CompetencyRepository extends JpaRepository<Competency, Long> {
  @Query(value = "SELECT * FROM competency", nativeQuery = true)
  List<CompetencyDto> getAllCompetencies();

  @Query(value = """
      SELECT EXISTS (
          SELECT 1
          FROM qualification_requirement
          WHERE competency_id = :id
      )
      """, nativeQuery = true)
  boolean isUsedByQualification(Long id);

  @Query(value = """
      SELECT EXISTS (
          SELECT 1
          FROM competency c
          WHERE c.name = :name
      )
      """, nativeQuery = true)
  boolean doesExist(String name);
}
