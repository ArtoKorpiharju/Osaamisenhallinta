package com.osaamisenhallinta.competency;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.osaamisenhallinta.competency.dto.CompetencyDto;
import com.osaamisenhallinta.employee.EmployeeCompetencyRepository;
import com.osaamisenhallinta.renewal.RenewalPlanRepository;
import com.osaamisenhallinta.testsupport.TestDataFactory;
import java.util.List;
import java.util.Optional;
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

  private Competency competencyEntity = TestDataFactory.competencyWithId(
      1L,
      "Fire Safety Training",
      CompetencyType.TRAINING,
      12
  );

  private Competency updatedCompetency = TestDataFactory.competencyWithId(
      1L,
      "New name",
      CompetencyType.OTHER,
      14
  );


  @Mock private RenewalPlanRepository renewalPlanRepository;

  @Mock private EmployeeCompetencyRepository employeeCompetencyRepository;

  @Test 
  void getCompetencyById_ShouldReturnCompetencyDtoWhenCompetencyExists() {
    // Arrange = define
    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.of(competencyEntity));

    // Act
    CompetencyDto result = competencyService.getCompetencyById(competencyEntity.getId());
    
    // Assert
    assertNotNull(result);
    assertEquals(competencyEntity.getId(), result.competencyId());
    assertEquals(competencyEntity.getName(), result.competencyName());
    assertEquals(competencyEntity.getType(), result.competencyType());
    assertEquals(competencyEntity.getValidityMonths(), result.validityMonths());
  }

  @Test
  void getCompetencyById_ShouldBubbleUpExceptionWhenCompetencyNotFound() {
    // Arrange = define
    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.empty());

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class, 
        () -> competencyService.getCompetencyById(competencyEntity.getId()));

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
  }
  
  @Test
  void getAllCompetencies_ShouldMapAndReturnAllCompetenciesWhenOnlyOneExists() {
    // Arrange
    when(competencyRepository.findAll())
        .thenReturn(List.of(competencyEntity));

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
    Competency competencyEntity2 = new Competency(
        "Testing",
        CompetencyType.OTHER,
        null
    );

    // Arrange
    when(competencyRepository.findAll())
        .thenReturn(List.of(competencyEntity, competencyEntity2));

    // Act
    List<CompetencyDto> result = competencyService.getAllCompetencies();

    // Assert
    assertEquals(2, result.size());
  }

  @Test
  void createCompetency_ShouldReturnCompetencyDtoWhenCompetencyCreated() {

    // Arrange
    when(competencyRepository.existsByName(competencyEntity.getName()))
        .thenReturn(false);
    when(competencyRepository.save(any(Competency.class)))
        .thenReturn(competencyEntity);

    // Act
    CompetencyDto result = competencyService.createCompetency(
        competencyEntity.getName(),
        competencyEntity.getType(), 
        competencyEntity.getValidityMonths());

    // Assert
    assertNotNull(result);
    assertEquals(competencyEntity.getId(), result.competencyId());
    assertEquals(competencyEntity.getName(), result.competencyName());
    assertEquals(competencyEntity.getType(), result.competencyType());
    assertEquals(competencyEntity.getValidityMonths(), result.validityMonths());

    verify(competencyRepository).save(any(Competency.class));
  }

  @Test
  void createCompetency_ShouldBubbleUpExceptionWhenCompetencyExists() {
    // Arrange
    when(competencyRepository.existsByName(competencyEntity.getName()))
        .thenReturn(true);

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class, 
        () -> competencyService.createCompetency(
        competencyEntity.getName(),
        competencyEntity.getType(), 
        competencyEntity.getValidityMonths()));

    assertEquals(HttpStatus.CONFLICT, response.getStatusCode());

    verify(competencyRepository, never()).save(any(Competency.class));
  }

  @Test
  void deleteCompetency_ShouldBubbleUpExceptionWhenCompetencyNotFound() {
    // Arrange
    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.empty());

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class,
        () -> competencyService.deleteCompetency(competencyEntity.getId()));

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
  }

  @Test
  void deleteCompetency_ShouldBubbleUpExceptionWhenCompetencyIsUsedByQualification() {
    // Arrange
    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.of(competencyEntity));
    when(competencyRepository.isUsedByQualification(competencyEntity.getId()))
        .thenReturn(true);

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class,
        () -> competencyService.deleteCompetency(competencyEntity.getId()));

    assertEquals(HttpStatus.CONFLICT, response.getStatusCode());

    verify(renewalPlanRepository, never()).deleteByCompetencyId(competencyEntity.getId());
    verify(employeeCompetencyRepository, never()).deleteByCompetencyId(competencyEntity.getId());
    verify(competencyRepository, never()).delete(competencyEntity);
  }

  @Test
  void deleteCompetency_ShouldDeleteRelatedRecordsAndCompetencyWhenAllowed() {
    // Arrange
    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.of(competencyEntity));
    when(competencyRepository.isUsedByQualification(competencyEntity.getId()))
        .thenReturn(false);

    // Act
    competencyService.deleteCompetency(competencyEntity.getId());

    // Assert
    verify(renewalPlanRepository).deleteByCompetencyId(competencyEntity.getId());
    verify(employeeCompetencyRepository).deleteByCompetencyId(competencyEntity.getId());
    verify(competencyRepository).delete(competencyEntity);
  }

  @Test
  void updateCompetency_ShouldReturnUpdatedCompetencyDtoWhenCompetencyExists() {
    // Arrange = define
    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.of(competencyEntity));

    // Act
    CompetencyDto result = competencyService.updateCompetency(
        competencyEntity.getId(),
        updatedCompetency.getName(),
        updatedCompetency.getType(),
        updatedCompetency.getValidityMonths()
    );
    
    // Assert
    assertNotNull(result);
    assertEquals(competencyEntity.getId(), result.competencyId());
    assertEquals(competencyEntity.getName(), result.competencyName());
    assertEquals(competencyEntity.getType(), result.competencyType());
    assertEquals(competencyEntity.getValidityMonths(), result.validityMonths());
  }

  @Test 
  void updateCompetency_ShouldBubbleUpExceptionWhenCompetencyNotFound() {
    // Arrange = define
    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.empty());

    // Assert & act
    ResponseStatusException response = assertThrows(ResponseStatusException.class, 
        () -> competencyService.updateCompetency(
          competencyEntity.getId(),
          updatedCompetency.getName(),
          updatedCompetency.getType(),
          updatedCompetency.getValidityMonths())
    );

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
  }

  @Test 
  void updateCompetency_ShouldBubbleUpExceptionWhenCompetencyUnderThisNameExists() {
    String duplicateName = "First Aid Training";

    when(competencyRepository.findById(competencyEntity.getId()))
        .thenReturn(Optional.of(competencyEntity));

    when(competencyRepository.existsByName(duplicateName))
        .thenReturn(true);

    ResponseStatusException response = assertThrows(ResponseStatusException.class, 
        () -> competencyService.updateCompetency(
          competencyEntity.getId(),
          duplicateName,
          updatedCompetency.getType(),
          updatedCompetency.getValidityMonths())
    );

    assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
  }
}
