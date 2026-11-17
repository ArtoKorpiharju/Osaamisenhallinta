package com.osaamisenhallinta.qualification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyRepository;
import com.osaamisenhallinta.competency.CompetencyType;
import com.osaamisenhallinta.employee.EmployeeQualificationRepository;
import com.osaamisenhallinta.qualification.dto.QualificationDto;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
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

  @Mock private Qualification mockQualificationEntity;

  @Mock private Qualification mockQualificationEntity2;

  @Mock private Competency mockCompetencyEntity;

  @Mock private EmployeeQualificationRepository employeeQualificationRepository;

  @Mock private CompetencyRepository competencyRepository;

  private final Long qualificationId = 1L;

  private final Long competencyId = 1L;

  private final Long testCompetencyId = 999L;


  @BeforeEach
  void setUp() {
    
    // Required competency
    lenient().when(mockCompetencyEntity.getId()).thenReturn(competencyId);
    lenient().when(mockCompetencyEntity.getName()).thenReturn("Fire Safety Training");
    lenient().when(mockCompetencyEntity.getType()).thenReturn(CompetencyType.TRAINING);
    lenient().when(mockCompetencyEntity.getValidityMonths()).thenReturn(12);
    
    // Qualification
    lenient().when(mockQualificationEntity.getId()).thenReturn(qualificationId);
    lenient().when(mockQualificationEntity.getName()).thenReturn("Warehouse Operator");
    lenient().when(mockQualificationEntity.getRequiredCompetencies())
        .thenReturn(Set.of(mockCompetencyEntity));
  }
    
  @Test 
  void getQualificationById_ShouldReturnQualificationDtoWhenQualificationExists() {
    when(qualificationRepository.findById(qualificationId))
        .thenReturn(Optional.of(mockQualificationEntity));

    QualificationDto result = qualificationService.getQualificationById(qualificationId);

    assertNotNull(result);
    assertEquals(qualificationId, result.qualificationId());
    assertEquals(mockQualificationEntity.getName(), result.qualificationName());
    assertEquals(mockQualificationEntity.getRequiredCompetencies().size(),
        result.requiredCompetencies().size());
    assertEquals(mockCompetencyEntity.getName(), 
        result.requiredCompetencies().get(0).competencyName());
  }

  @Test 
  void getQualificationById_ShouldBubbleUpExceptionWhenQualificationNotFound() {
    when(qualificationRepository.findById(qualificationId))
        .thenReturn(Optional.empty());

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.getQualificationById(qualificationId));
      
    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
  }

  @Test 
  void getAllQualifications_ShouldMapAndReturnAllQualificationsWhenOnlyOneExists() {
    when(qualificationRepository.findAll())
        .thenReturn(List.of(mockQualificationEntity));

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
    when(qualificationRepository.findAll())
        .thenReturn(List.of(mockQualificationEntity, mockQualificationEntity2));

    List<QualificationDto> result = qualificationService.getAllQualifications();

    assertEquals(2, result.size());
  }

  @Test 
  void createQualification_ShouldReturnQualificationDtoWhenQualificationCreated() {
    when(qualificationRepository.existsByName(mockQualificationEntity.getName()))
        .thenReturn(false);
    when(competencyRepository.findAllById(Set.of(competencyId)))
        .thenReturn(List.of(mockCompetencyEntity));
    when(qualificationRepository.save(any(Qualification.class)))
        .thenReturn(mockQualificationEntity);

    QualificationDto result = qualificationService.createQualification(
        mockQualificationEntity.getName(), 
        List.of(competencyId));

    assertNotNull(result);
    assertEquals(qualificationId, result.qualificationId());
    assertEquals(mockQualificationEntity.getName(), result.qualificationName());
    assertEquals(mockQualificationEntity.getRequiredCompetencies().size(), 
        result.requiredCompetencies().size());

    verify(qualificationRepository).save(any(Qualification.class));
  }

  @Test
  void createQualification_ShouldBubbleUpExceptionWhenQualificationExists() {
    when(qualificationRepository.existsByName(mockQualificationEntity.getName()))
        .thenReturn(true);

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.createQualification(
          mockQualificationEntity.getName(), 
          List.of(competencyId)));

    assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
    verify(qualificationRepository, never()).save(any(Qualification.class));
  }

  @Test
  void createQualification_ShouldBubbleUpWhenSomeRequiredCompetenciesMissing() {
    when(qualificationRepository.existsByName(mockQualificationEntity.getName()))
        .thenReturn(false);

    when(competencyRepository.findAllById(Set.of(competencyId, testCompetencyId)))
        .thenReturn(List.of(mockCompetencyEntity));

    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.createQualification(
          mockQualificationEntity.getName(),
          List.of(competencyId, testCompetencyId)));

    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    verify(qualificationRepository, never()).save(any(Qualification.class));
  }

  @Test
  void deleteQualification_ShouldBubbleUpExceptionWhenQualificationNotFound() {
    when(qualificationRepository.findById(qualificationId))
        .thenReturn(Optional.empty());
    
    ResponseStatusException result = assertThrows(ResponseStatusException.class,
        () -> qualificationService.deleteQualification(qualificationId));
      
    assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());

    verify(employeeQualificationRepository, never()).deleteByQualificationId(qualificationId);
    verify(qualificationRepository, never()).delete(mockQualificationEntity);
  }

  @Test
  void deleteQualification_ShouldDeleteRelatedRecordsAndQualificationWhenAllowed() {
    when(qualificationRepository.findById(qualificationId))
        .thenReturn(Optional.of(mockQualificationEntity));

    qualificationService.deleteQualification(qualificationId);

    verify(employeeQualificationRepository).deleteByQualificationId(qualificationId);
    verify(qualificationRepository).delete(mockQualificationEntity);
  }
}
