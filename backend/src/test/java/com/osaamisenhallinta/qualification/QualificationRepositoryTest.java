package com.osaamisenhallinta.qualification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyType;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
class QualificationRepositoryTest {
    
  @Autowired private QualificationRepository qualificationRepository;

  @Autowired private TestEntityManager entityManager;

  private Competency competency;

  private Qualification qualification;

  private final Long qualificationId = 1L;

  private final Long nonExistingQualificationId = 999L;

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
  void findById_ShouldReturnQualificationWithRequiredCompetencies() {
    entityManager.persist(competency);
    entityManager.persist(qualification);

    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context

    Optional<Qualification> result = 
        qualificationRepository.findById(qualificationId);

    assertThat(result).isPresent();
    assertThat(result.get().getRequiredCompetencies())
        .hasSize(1);
  }

  @Test 
  void findById_ShouldReturnEmptyWhenQualificationDoesntExist() {
    assertThat(qualificationRepository.findById(nonExistingQualificationId)).isEmpty();
  }

  @Test 
  void findAll_ShouldReturnAllQualificationsWithTheirRequiredCompetencies() {
    Competency competency2 = new Competency(
        "First Aid Training", 
        CompetencyType.TRAINING, 
        null);

    Qualification qualification2 = new Qualification(
        "First Aid Responder",
        Set.of(competency2)
    );

    entityManager.persist(competency);
    entityManager.persist(competency2);
    entityManager.persist(qualification);
    entityManager.persist(qualification2);

    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context

    List<Qualification> result = qualificationRepository.findAll();

    assertThat(result).hasSize(2);

    assertThat(result)
        .extracting(Qualification::getName)
        .containsExactlyInAnyOrder(qualification.getName(), qualification2.getName());
    
    assertThat(result)
        .extracting(Qualification::getRequiredCompetencies)
        .allSatisfy(competencies -> assertThat(competencies).hasSize(1));
  }

  @Test
  void findAll_ShouldReturnEmplyListWhenNoQualificationsExist() {
    List<Qualification> result = qualificationRepository.findAll();
    assertThat(result).isEmpty();
  }

  @Test
  void existsByName_ShouldReturnTrueWhenQualificationExists() {
    entityManager.persist(qualification);
    entityManager.flush(); // sends pending changes to the database
    entityManager.clear(); // removes entitites from the persistence context
    
    boolean result = qualificationRepository.existsByName(qualification.getName());
    assertThat(result).isTrue();
  }

  @Test
  void existsByName_ShouldReturnFalseWhenQualificationDoesntExist() {
    boolean result = qualificationRepository.existsByName("Non-existent");
    assertThat(result).isFalse();
  }

  @Test
  void getByIdOrThrow_ShouldThrowWhenQualificationDoesntExist() {
    assertThatThrownBy(() -> 
        qualificationRepository.getByIdOrThrow(nonExistingQualificationId)
    )
        .isInstanceOf(EntityNotFoundException.class)
        .hasMessageContaining("Qualification not found with id: " + nonExistingQualificationId);
  }
}