package com.osaamisenhallinta.competency;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.osaamisenhallinta.competency.dto.CompetencyDto;
import com.osaamisenhallinta.employee.EmployeeCompetencyRepository;
import com.osaamisenhallinta.renewal.RenewalPlanRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class CompetencyServiceTest {

  @InjectMocks private CompetencyService competencyService;

  @Mock private CompetencyRepository competencyRepository;

  @Mock private Competency mockCompetencyEntity;
  
  @Mock private Competency mockCompetencyEntity2;

  @Mock private RenewalPlanRepository renewalPlanRepository;

  @Mock private EmployeeCompetencyRepository employeeCompetencyRepository;

  private final Long competencyId = 1L;

  @BeforeEach
  void setUp() {
    lenient().when(mockCompetencyEntity.getId()).thenReturn(competencyId);
    lenient().when(mockCompetencyEntity.getName()).thenReturn("Fire Safety Training");
    lenient().when(mockCompetencyEntity.getType()).thenReturn(CompetencyType.TRAINING);
    lenient().when(mockCompetencyEntity.getValidityMonths()).thenReturn(12);
  }

  @Test 
  void getCompetencyById_ShouldReturnCompetencyDtoWhenCompetencyExists() {
    // Arrange = define
    when(competencyRepository.findById(competencyId))
        .thenReturn(Optional.of(mockCompetencyEntity));

    // Act
    CompetencyDto result = competencyService.getCompetencyById(competencyId);
    
    // Assert
    assertNotNull(result);
    assertEquals(competencyId, result.competencyId());
    assertEquals(mockCompetencyEntity.getName(), result.competencyName());
    assertEquals(mockCompetencyEntity.getType(), result.competencyType());
    assertEquals(mockCompetencyEntity.getValidityMonths(), result.validityMonths());
  }

  @Test
  void getCompetencyById_ShouldBubbleUpExceptionWhenCompetencyNotFound() {
    // Arrange = define
    when(competencyRepository.findById(competencyId))
        .thenReturn(Optional.empty());

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class, 
        () -> competencyService.getCompetencyById(competencyId));

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
  }
  
  @Test
  void getAllCompetencies_ShouldMapAndReturnAllCompetenciesWhenOnlyOneExists() {
    // Arrange
    when(competencyRepository.findAll())
        .thenReturn(List.of(mockCompetencyEntity));

    // Act
    List<CompetencyDto> result = competencyService.getAllCompetencies();

    // Assert
    assertEquals(1, result.size());
  }

  @Test
  void getAllCompetencies_ShouldReturnEmptyListWhenNoneExist() {
    // Arrange
    when(competencyRepository.findAll())
        .thenReturn(List.of());

    // Act
    List<CompetencyDto> result = competencyService.getAllCompetencies();

    // Assert
    assertTrue(result.isEmpty());
  }

  @Test 
  void getAllCompetencies_ShouldMapAndReturnAllCompetenciesWhenMultipleExist() {
    // Arrange
    when(competencyRepository.findAll())
        .thenReturn(List.of(mockCompetencyEntity, mockCompetencyEntity2));

    // Act
    List<CompetencyDto> result = competencyService.getAllCompetencies();

    // Assert
    assertEquals(2, result.size());
  }

  @Test
  void createCompetency_ShouldReturnCompetencyDtoWhenCompetencyCreated() {

    // Arrange
    when(competencyRepository.existsByName(mockCompetencyEntity.getName()))
        .thenReturn(false);
    when(competencyRepository.save(any(Competency.class)))
        .thenReturn(mockCompetencyEntity);

    // Act
    CompetencyDto result = competencyService.createCompetency(
        mockCompetencyEntity.getName(),
        mockCompetencyEntity.getType(), 
        mockCompetencyEntity.getValidityMonths());

    // Assert
    assertNotNull(result);
    assertEquals(competencyId, result.competencyId());
    assertEquals(mockCompetencyEntity.getName(), result.competencyName());
    assertEquals(mockCompetencyEntity.getType(), result.competencyType());
    assertEquals(mockCompetencyEntity.getValidityMonths(), result.validityMonths());

    verify(competencyRepository).save(any(Competency.class));
  }

  @Test
  void createCompetency_ShouldBubbleUpExceptionWhenCompetencyExists() {
    // Arrange
    when(competencyRepository.existsByName(mockCompetencyEntity.getName()))
        .thenReturn(true);

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class, 
        () -> competencyService.createCompetency(
        mockCompetencyEntity.getName(),
        mockCompetencyEntity.getType(), 
        mockCompetencyEntity.getValidityMonths()));

    assertEquals(HttpStatus.CONFLICT, response.getStatusCode());

    verify(competencyRepository, never()).save(any(Competency.class));
  }

  @Test
  void deleteCompetency_ShouldBubbleUpExceptionWhenCompetencyNotFound() {
    // Arrange
    when(competencyRepository.findById(competencyId))
        .thenReturn(Optional.empty());

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class,
        () -> competencyService.deleteCompetency(competencyId));

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
  }

  @Test
  void deleteCompetency_ShouldBubbleUpExceptionWhenCompetencyIsUsedByQualification() {
    // Arrange
    when(competencyRepository.findById(competencyId))
        .thenReturn(Optional.of(mockCompetencyEntity));
    when(competencyRepository.isUsedByQualification(competencyId))
        .thenReturn(true);

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class,
        () -> competencyService.deleteCompetency(competencyId));

    assertEquals(HttpStatus.CONFLICT, response.getStatusCode());

    verify(renewalPlanRepository, never()).deleteByCompetencyId(competencyId);
    verify(employeeCompetencyRepository, never()).deleteByCompetencyId(competencyId);
    verify(competencyRepository, never()).delete(mockCompetencyEntity);
  }

  @Test
  void deleteCompetency_ShouldDeleteRelatedRecordsAndCompetencyWhenAllowed() {
    // Arrange
    when(competencyRepository.findById(competencyId))
        .thenReturn(Optional.of(mockCompetencyEntity));
    when(competencyRepository.isUsedByQualification(competencyId))
        .thenReturn(false);

    // Act
    competencyService.deleteCompetency(competencyId);

    // Assert
    verify(renewalPlanRepository).deleteByCompetencyId(competencyId);
    verify(employeeCompetencyRepository).deleteByCompetencyId(competencyId);
    verify(competencyRepository).delete(mockCompetencyEntity);
  }
}
