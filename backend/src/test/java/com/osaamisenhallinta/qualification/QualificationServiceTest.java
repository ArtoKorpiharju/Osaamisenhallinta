package com.osaamisenhallinta.qualification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyRepository;
import com.osaamisenhallinta.competency.CompetencyType;
import com.osaamisenhallinta.employee.EmployeeQualificationRepository;
import com.osaamisenhallinta.qualification.dto.QualificationDto;
import com.osaamisenhallinta.testsupport.TestDataFactory;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class QualificationServiceTest {

  @InjectMocks private QualificationService qualificationService;

  @Mock private QualificationRepository qualificationRepository;

  private Competency competencyEntity = TestDataFactory.competencyWithId(
      1L,
      "Fire Safety Training",
      CompetencyType.TRAINING,
      12
  );

  private Qualification qualificationEntity = TestDataFactory.qualificationWithId(
      1L,
      "Warehouse Operator",
      Set.of(competencyEntity)
  );

  private Qualification updatedQualification = TestDataFactory.qualificationWithId(
      1L,
      "New name",
      Set.of(competencyEntity)
  );

  @Mock private EmployeeQualificationRepository employeeQualificationRepository;

  @Mock private CompetencyRepository competencyRepository;

  private final Long testCompetencyId = 999L;

    
  @Test 
  void getQualificationById_ShouldReturnQualificationDtoWhenQualificationExists() {
    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.of(qualificationEntity));

    QualificationDto result = qualificationService
        .getQualificationById(qualificationEntity.getId());

    assertNotNull(result);
    assertEquals(qualificationEntity.getId(), result.qualificationId());
    assertEquals(qualificationEntity.getName(), result.qualificationName());
    assertEquals(qualificationEntity.getRequiredCompetencies().size(),
        result.requiredCompetencies().size());
    assertEquals(competencyEntity.getName(), 
        result.requiredCompetencies().get(0).competencyName());
  }

  @Test 
  void getQualificationById_ShouldBubbleUpExceptionWhenQualificationNotFound() {
    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.empty());

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.getQualificationById(qualificationEntity.getId()));
      
    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
  }

  @Test 
  void getAllQualifications_ShouldMapAndReturnAllQualificationsWhenOnlyOneExists() {
    when(qualificationRepository.findAll())
        .thenReturn(List.of(qualificationEntity));

    List<QualificationDto> result = qualificationService.getAllQualifications();

    assertEquals(1, result.size());
  }

  @Test 
  void getAllQualifications_ShouldReturnEmptyListWhenNoneExist() {
    when(qualificationRepository.findAll())
        .thenReturn(List.of());

    List<QualificationDto> result = qualificationService.getAllQualifications();

    assertTrue(result.isEmpty());
  }

  @Test 
  void getAllQualifications_ShouldMapAndReturnAllQualificationsWhenMultipleExist() {
    Qualification qualificationEntity2 = new Qualification(
        "Testing",
        Set.of(competencyEntity)
    );
    when(qualificationRepository.findAll())
        .thenReturn(List.of(qualificationEntity, qualificationEntity2));

    List<QualificationDto> result = qualificationService.getAllQualifications();

    assertEquals(2, result.size());
  }

  @Test 
  void createQualification_ShouldReturnQualificationDtoWhenQualificationCreated() {
    when(qualificationRepository.existsByName(qualificationEntity.getName()))
        .thenReturn(false);

    when(competencyRepository.findAllById(Set.of(competencyEntity.getId())))
        .thenReturn(List.of(competencyEntity));

    when(qualificationRepository.save(any(Qualification.class)))
        .thenReturn(qualificationEntity);

    QualificationDto result = qualificationService.createQualification(
        qualificationEntity.getName(), 
        List.of(competencyEntity.getId()));

    assertNotNull(result);
    assertEquals(qualificationEntity.getId(), result.qualificationId());
    assertEquals(qualificationEntity.getName(), result.qualificationName());
    assertEquals(qualificationEntity.getRequiredCompetencies().size(), 
        result.requiredCompetencies().size());

    verify(qualificationRepository).save(any(Qualification.class));
  }

  @Test
  void createQualification_ShouldBubbleUpExceptionWhenQualificationExists() {
    when(qualificationRepository.existsByName(qualificationEntity.getName()))
        .thenReturn(true);

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.createQualification(
          qualificationEntity.getName(), 
          List.of(competencyEntity.getId())));

    assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
    verify(qualificationRepository, never()).save(any(Qualification.class));
  }

  @Test
  void createQualification_ShouldBubbleUpWhenSomeRequiredCompetenciesMissing() {
    when(qualificationRepository.existsByName(qualificationEntity.getName()))
        .thenReturn(false);

    when(competencyRepository.findAllById(Set.of(competencyEntity.getId(), testCompetencyId)))
        .thenReturn(List.of(competencyEntity));

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.createQualification(
          qualificationEntity.getName(),
          List.of(competencyEntity.getId(), testCompetencyId)));

    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    verify(qualificationRepository, never()).save(any(Qualification.class));
  }

  @Test
  void deleteQualification_ShouldBubbleUpExceptionWhenQualificationNotFound() {
    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.empty());
    
    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.deleteQualification(qualificationEntity.getId()));
      
    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());

    verify(employeeQualificationRepository, never())
        .deleteByQualificationId(qualificationEntity.getId());
    verify(qualificationRepository, never()).delete(qualificationEntity);
  }

  @Test
  void deleteQualification_ShouldDeleteRelatedRecordsAndQualificationWhenAllowed() {
    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.of(qualificationEntity));

    qualificationService.deleteQualification(qualificationEntity.getId());

    verify(employeeQualificationRepository).deleteByQualificationId(qualificationEntity.getId());
    verify(qualificationRepository).delete(qualificationEntity);
  }

  @Test
  void updateQualification_ShouldReturnUpdatedQualificationDtoWhenQualificationExists() {
    // Create a copy
    final String oldName = qualificationEntity.getName();
  
    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.of(qualificationEntity));

    when(competencyRepository.findAllById(Set.of(competencyEntity.getId())))
        .thenReturn(List.of(competencyEntity));

    QualificationDto result = qualificationService
        .updateQualification(
          qualificationEntity.getId(),
          updatedQualification.getName(),
          List.of(competencyEntity.getId()));

    assertNotNull(result);
    assertEquals(updatedQualification.getId(), result.qualificationId());
    assertEquals(updatedQualification.getName(), result.qualificationName());
    assertEquals(updatedQualification.getRequiredCompetencies().size(),
        result.requiredCompetencies().size());
    assertEquals(competencyEntity.getName(), 
        result.requiredCompetencies().get(0).competencyName());

    assertNotEquals(updatedQualification.getName(), oldName);
  }

  @Test 
  void updateQualification_ShouldBubbleUpExceptionWhenQualificationNotFound() {
    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.empty());

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.updateQualification(
          qualificationEntity.getId(),
          updatedQualification.getName(),
          List.of(competencyEntity.getId())));
      
    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
  }

  @Test
  void updateQualification_ShouldBubbleUpWhenSomeRequiredCompetenciesMissing() {
    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.of(qualificationEntity));

    when(competencyRepository.findAllById(Set.of(competencyEntity.getId(), testCompetencyId)))
        .thenReturn(List.of(competencyEntity));

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.updateQualification(
          qualificationEntity.getId(),
          updatedQualification.getName(),
          List.of(competencyEntity.getId(), testCompetencyId)));

    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    verify(qualificationRepository, never()).save(any(Qualification.class));
  }

  @Test 
  void updateQualification_ShouldBubbleUpExceptionWhenQualificationUnderThisNameExists() {
    String duplicateName = "First Aid Responder";

    when(qualificationRepository.findById(qualificationEntity.getId()))
        .thenReturn(Optional.of(qualificationEntity));

    when(competencyRepository.findAllById(Set.of(competencyEntity.getId())))
        .thenReturn(List.of(competencyEntity));

    when(qualificationRepository.existsByName(duplicateName))
        .thenReturn(true);

    ResponseStatusException response = assertThrows(ResponseStatusException.class, 
        () -> qualificationService.updateQualification(
          qualificationEntity.getId(),
          duplicateName,
          List.of(competencyEntity.getId()))
    );

    assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
  }
}
