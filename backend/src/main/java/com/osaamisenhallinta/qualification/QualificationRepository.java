package com.osaamisenhallinta.qualification;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Database access for qualifications. */
public interface QualificationRepository extends JpaRepository<Qualification, Long> {
  @Query("""
      SELECT DISTINCT q
      FROM Qualification q
      LEFT JOIN FETCH q.requiredCompetencies
      WHERE q.id = :id
      """)
  Optional<Qualification> findById(@Param("id") Long id);

  @Query("""
      SELECT DISTINCT q
      FROM Qualification q
      LEFT JOIN FETCH q.requiredCompetencies
      """)
  List<Qualification> findAll();
}
