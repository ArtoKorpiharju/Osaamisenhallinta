package com.osaamisenhallinta.qualification;

import static org.mockito.Mockito.lenient;

import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

class QualificationServiceTest {

  @InjectMocks private QualificationService qualificationService;

  @Mock private QualificationRepository qualificationRepository;

  @Mock private Qualification mockQualificationEntity;

  private final Long qualificationId = 1L;

  @BeforeEach
  void setUp() {
    lenient().when(mockQualificationEntity.getId()).thenReturn(qualificationId);
    lenient().when(mockQualificationEntity.getName()).thenReturn("Warehouse Operator");
    // lenient().when(mockQualificationEntity.getRequiredCompetencies()).thenReturn(Set.of(1, 4));
  }
    
  @Test 
  void getQualificationById_ShouldReturnQualificationDtoWhenQualificationExists() {

  }

  @Test 
  void getQualificationById_ShouldBubbleUpExceptionWhenQualificationNotFound() {

  }

  @Test 
  void getAllQualifications_ShouldMapAndReturnAllQualificationsWhenOnlyOneExists() {

  }

  @Test 
  void getAllQualifications_ShouldReturnEmptyListWhenNoneExist() {

  }

  @Test 
  void getAllQualifications_ShouldMapAndReturnAllQualificationsWhenMultipleExist() {

  }

  @Test 
  void createQualification_ShouldReturnQualificationDtoWhenQualificationCreated() {

  }

  @Test
  void createQualification_ShouldBubbleUpExceptionWhenQualificationAlreadyExists() {

  }

  // createQualification: should bubble up if no required competencies are found

  @Test
  void createQualification_ShouldNotSaveAnythingWhenDuplicateFound() {

  }

  @Test
  void deleteQualification_ShouldBubbleUpExceptionWhenQualificationNotFound() {

  }

  @Test
  void deleteQualification_ShouldDeleteRelatedRecordsAndQualificationWhenAllowed() {

  }
}
