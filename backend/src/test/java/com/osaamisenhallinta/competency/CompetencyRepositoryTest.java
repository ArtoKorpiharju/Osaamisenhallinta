package com.osaamisenhallinta.competency;

import static org.assertj.core.api.Assertions.assertThat;

import com.osaamisenhallinta.qualification.Qualification;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@DataJpaTest
@Testcontainers 
class CompetencyRepositoryTest {

  @Autowired private CompetencyRepository competencyRepository;

  @Autowired private TestEntityManager entityManager;
  
  private Competency competency = new Competency(
      "TEST Fire Safety Training", 
      CompetencyType.TRAINING, 
      12
  );

  private Qualification qualification = new Qualification(
      "TEST Warehouse Operator",
      Set.of(competency)
  );

  private final Long nonExistingCompetencyId = 999L;

  @Container
  @ServiceConnection
   static PostgreSQLContainer postgres =
        new PostgreSQLContainer("postgres:16-alpine");

  @Test 
  void isUsedByQualification_ShouldReturnTrueIfCompetencyIsInUse() {
    entityManager.persist(competency);
    entityManager.persist(qualification);

    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context

    boolean result = competencyRepository.isUsedByQualification(competency.getId());
    assertThat(result).isTrue();
  }

  @Test 
  void isUsedByQualification_ShouldReturnFalseIfCompetencyNotInUse() {
    entityManager.persist(competency);

    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context

    boolean result = competencyRepository.isUsedByQualification(competency.getId());
    assertThat(result).isFalse();
  }

  @Test 
  void isUsedByQualification_ShouldReturnFalseIfCompetencyDoesNotExist() {
    boolean result = competencyRepository.isUsedByQualification(nonExistingCompetencyId);
    assertThat(result).isFalse();
  }
}
