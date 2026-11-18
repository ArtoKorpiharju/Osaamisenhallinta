package com.osaamisenhallinta.testsupport;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyType;
import com.osaamisenhallinta.qualification.Qualification;
import java.util.Set;
import org.springframework.test.util.ReflectionTestUtils;

/** Test constructors for entitites. */
public final class TestDataFactory {

  private TestDataFactory() {}

  /** Constructor with id for competency.  */
  public static Competency competencyWithId(
      Long id, String name, CompetencyType type, Integer validityMonths) {
    Competency competency = new Competency(name, type, validityMonths);
    ReflectionTestUtils.setField(competency, "id", id);
    return competency;
  }

  /** Constructor with id for competency.  */
  public static Qualification qualificationWithId(
      Long id, String name, Set<Competency> requiredCompetencies) {
    Qualification qualification = new Qualification(name, requiredCompetencies);
    ReflectionTestUtils.setField(qualification, "id", id);
    return qualification;
  }
}
