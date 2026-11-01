package com.osaamisenhallinta.qualification;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Database access for qualifications. */
public interface QualificationRepository extends JpaRepository<Qualification, Long> {
  @Query("""
      SELECT DISTINCT q
      FROM Qualification q
      LEFT JOIN FETCH q.requiredCompetencies
      WHERE q.id = :id
      """)
  Optional<Qualification> findById(Long id);

  @Query("""
      SELECT DISTINCT q
      FROM Qualification q
      LEFT JOIN FETCH q.requiredCompetencies
      """)
  List<Qualification> findAllQualifications();
}
