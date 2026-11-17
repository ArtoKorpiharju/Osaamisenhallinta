package com.osaamisenhallinta.competency;

import static org.assertj.core.api.Assertions.assertThat;

import com.osaamisenhallinta.qualification.Qualification;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
class CompetencyRepositoryTest {

  @Autowired private CompetencyRepository competencyRepository;

  @Autowired private TestEntityManager entityManager;
  
  private Competency competency;

  private Qualification qualification;

  private final Long competencyId = 1L;

  @BeforeEach 
  void setUp() {
    competency = new Competency(
      "Fire Safety Training", 
      CompetencyType.TRAINING, 
      12
    );

    qualification = new Qualification(
      "Warehouse Operator",
      Set.of(competency)
    );
  }

  @Test 
  void isUsedByQualification_ShouldReturnTrueIfCompetencyIsInUse() {
    entityManager.persist(competency);
    entityManager.persist(qualification);

    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context

    boolean result = competencyRepository.isUsedByQualification(competencyId);
    assertThat(result).isTrue();
  }

  @Test 
  void isUsedByQualification_ShouldReturnFalseIfCompetencyNotInUse() {
    entityManager.persist(competency);

    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context

    boolean result = competencyRepository.isUsedByQualification(competencyId);
    assertThat(result).isFalse();
  }

  @Test
  void existsByName_ShouldReturnTrueWhenCompetencyExists() {
    entityManager.persist(competency);
    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context
    
    boolean result = competencyRepository.existsByName(competency.getName());
    assertThat(result).isTrue();
  }

  @Test
  void existsByName_ShouldReturnFalseWhenCompetencyDoesntExist() {
    boolean result = competencyRepository.existsByName("Non-existent");
    assertThat(result).isFalse();
  }
    
}
