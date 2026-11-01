package com.osaamisenhallinta.qualification;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Database access for qualifications. */
public interface QualificationRepository extends JpaRepository<Qualification, Long> {
  // TO-DO: get qualification requirements here as well by joining tables
  @Query(value = "SELECT * FROM qualification", nativeQuery = true)
  List<QualificationDto> findAllQualifications();
}
