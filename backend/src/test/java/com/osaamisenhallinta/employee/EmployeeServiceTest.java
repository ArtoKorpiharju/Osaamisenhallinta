package com.osaamisenhallinta.employee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.employee.dto.EmployeeCompetencyDto;
import com.osaamisenhallinta.employee.dto.EmployeeOverviewDto;
import com.osaamisenhallinta.employee.dto.EmployeeQualificationDto;
import com.osaamisenhallinta.qualification.Qualification;
import com.osaamisenhallinta.qualification.QualificationEvaluationResult;
import com.osaamisenhallinta.qualification.QualificationEvaluator;
import com.osaamisenhallinta.qualification.QualificationStatus;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import com.osaamisenhallinta.user.UserRole;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

  @Mock private UserRepository userRepository;

  @Mock private QualificationEvaluator qualificationEvaluator;

  @InjectMocks private EmployeeService employeeService;

  @Mock private User mockEmployee;

  @Mock private EmployeeQualification mockCriticalQualification;

  @Mock private EmployeeQualification mockStandardQualification;

  @Mock private Qualification mockQualificationEntity;

  @Mock private EmployeeCompetency mockEmployeeCompetency;

  @Mock private Competency mockCompetencyEntity;

  private final Long employeeId = 1L;

  @BeforeEach
  void setUp() {
    // We only set up leniency for common entity methods to avoid UnnecessaryStubbingExceptions
    // across different tests that might not use all of them.
    lenient().when(mockEmployee.getId()).thenReturn(employeeId);
    lenient().when(mockEmployee.getFirstName()).thenReturn("John");
    lenient().when(mockEmployee.getLastName()).thenReturn("Doe");
    lenient().when(mockEmployee.getEmail()).thenReturn("john.doe@email.com");
    lenient().when(mockEmployee.getRole()).thenReturn(UserRole.EMPLOYEE);
  }

  @Test
  void getEmployeeById_ShouldFilterQualificationsAndDelegateToEvaluator() {
    // Arrange: Setup all four truth table combinations with unique IDs

    // 1. True / False
    EmployeeQualification mockCritical = mock(EmployeeQualification.class);
    when(mockCritical.getId()).thenReturn(10L);
    when(mockCritical.isCritical()).thenReturn(true);
    lenient().when(mockCritical.isFavourite()).thenReturn(false);
    when(mockCritical.getQualification()).thenReturn(mockQualificationEntity);

    // 2. False / True
    EmployeeQualification mockFavourite = mock(EmployeeQualification.class);
    when(mockFavourite.getId()).thenReturn(20L);
    when(mockFavourite.isCritical()).thenReturn(false);
    when(mockFavourite.isFavourite()).thenReturn(true);
    when(mockFavourite.getQualification()).thenReturn(mockQualificationEntity);

    // 3. True / True
    EmployeeQualification mockBoth = mock(EmployeeQualification.class);
    when(mockBoth.getId()).thenReturn(30L);
    // In case of short circuiting, use lenient() to avoid unnecessary stubbing exceptions
    lenient().when(mockBoth.isCritical()).thenReturn(true);
    lenient().when(mockBoth.isFavourite()).thenReturn(true);
    when(mockBoth.getQualification()).thenReturn(mockQualificationEntity);

    // 4. False / False
    EmployeeQualification mockNeither = mock(EmployeeQualification.class);
    lenient().when(mockNeither.getId()).thenReturn(40L);
    when(mockNeither.isCritical()).thenReturn(false);
    when(mockNeither.isFavourite()).thenReturn(false);

    when(userRepository.getEmployeeByIdOrThrow(employeeId)).thenReturn(mockEmployee);

    when(mockEmployee.getEmployeeQualifications())
        .thenReturn(Set.of(mockCritical, mockFavourite, mockBoth, mockNeither));

    QualificationEvaluationResult mockResult =
        new QualificationEvaluationResult(QualificationStatus.QUALIFIED, null, 1, 1, List.of());
    when(qualificationEvaluator.evaluateQualification(any(), any())).thenReturn(mockResult);

    // Act
    EmployeeOverviewDto result = employeeService.getEmployeeById(employeeId);

    // Assert: Verify business logic
    assertNotNull(result);
    assertEquals(3, result.qualifications().size());

    // Extract the IDs from the resulting DTOs to prove the correct items survived
    List<Long> resultingIds =
        result.qualifications().stream()
            .map(EmployeeQualificationDto::employeeQualificationId)
            .toList();

    assertTrue(resultingIds.contains(10L), "Critical item should be present");
    assertTrue(resultingIds.contains(20L), "Favourite item should be present");
    assertTrue(resultingIds.contains(30L), "Item that is both should be present");
    assertFalse(resultingIds.contains(40L), "Item that is neither should be dropped");

    verify(qualificationEvaluator, times(3))
        .evaluateQualification(eq(mockQualificationEntity), any());
  }

  @Test
  void getEmployeeById_ShouldBubbleUpExceptionWhenEmployeeNotFound() {
    // Arrange: The repository throws the EntityNotFoundException defined in its default method
    when(userRepository.getEmployeeByIdOrThrow(employeeId))
        .thenThrow(new EntityNotFoundException("Employee not found"));

    // Act & Assert
    assertThrows(EntityNotFoundException.class, () -> employeeService.getEmployeeById(employeeId));

    // Verify no further logic was executed
    verify(qualificationEvaluator, never()).evaluateQualification(any(), any());
  }

  @Test
  void getEmployeeQualifications_ShouldReturnAllQualificationsUnfiltered() {
    // Arrange
    when(userRepository.getEmployeeByIdOrThrow(employeeId)).thenReturn(mockEmployee);

    when(mockCriticalQualification.getQualification()).thenReturn(mockQualificationEntity);
    when(mockStandardQualification.getQualification()).thenReturn(mockQualificationEntity);

    // Give the employee both qualifications
    when(mockEmployee.getEmployeeQualifications())
        .thenReturn(Set.of(mockCriticalQualification, mockStandardQualification));
    when(mockEmployee.getEmployeeCompetencies()).thenReturn(Set.of());

    QualificationEvaluationResult mockResult =
        new QualificationEvaluationResult(QualificationStatus.QUALIFIED, null, 1, 1, List.of());
    when(qualificationEvaluator.evaluateQualification(any(), any())).thenReturn(mockResult);

    // Act
    List<EmployeeQualificationDto> result = employeeService.getEmployeeQualifications(employeeId);

    // Assert
    assertNotNull(result);
    // Verify no filtering occurred: both should be returned
    assertEquals(2, result.size());
    verify(qualificationEvaluator, times(2)).evaluateQualification(any(), any());
  }

  @Test
  void getEmployeeQualifications_ShouldBubbleUpExceptionWhenEmployeeNotFound() {
    // Arrange: Simulate the repository failing to find the employee
    when(userRepository.getEmployeeByIdOrThrow(employeeId))
        .thenThrow(new EntityNotFoundException("Employee not found"));

    // Act & Assert: Verify the exception bubbles straight through the method
    assertThrows(
        EntityNotFoundException.class, () -> employeeService.getEmployeeQualifications(employeeId));

    // Verify we never attempted to run business logic on a missing user
    verify(qualificationEvaluator, never()).evaluateQualification(any(), any());
  }

  @Test
  void getEmployeeCompetencies_ShouldMapAndReturnAllCompetenciesWhenOneExists() {
    // Arrange
    when(userRepository.getEmployeeByIdOrThrow(employeeId)).thenReturn(mockEmployee);

    // Setup nested competency data for the mapper
    when(mockCompetencyEntity.getId()).thenReturn(100L);
    when(mockCompetencyEntity.getName()).thenReturn("First Aid");
    when(mockEmployeeCompetency.getCompetency()).thenReturn(mockCompetencyEntity);

    when(mockEmployee.getEmployeeCompetencies()).thenReturn(Set.of(mockEmployeeCompetency));

    // Act
    List<EmployeeCompetencyDto> result = employeeService.getEmployeeCompetencies(employeeId);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals("First Aid", result.get(0).competencyName());
  }

  @Test
  void getEmployeeCompetencies_ShouldReturnEmptyListWhenNoneExist() {
    // Arrange: ZERO items
    when(userRepository.getEmployeeByIdOrThrow(employeeId)).thenReturn(mockEmployee);
    when(mockEmployee.getEmployeeCompetencies()).thenReturn(Set.of()); // Empty set

    // Act
    List<EmployeeCompetencyDto> result = employeeService.getEmployeeCompetencies(employeeId);

    // Assert: Proves it doesn't crash or return null when no competencies exist
    assertNotNull(result);
    assertTrue(result.isEmpty());
  }

  @Test
  void getEmployeeCompetencies_ShouldMapAndReturnAllCompetenciesWhenMultipleExist() {
    // Arrange: MANY (2) items
    when(userRepository.getEmployeeByIdOrThrow(employeeId)).thenReturn(mockEmployee);

    // Setup Mock 1
    EmployeeCompetency mockCompetency1 = mock(EmployeeCompetency.class);
    Competency mockEntity1 = mock(Competency.class);
    when(mockEntity1.getId()).thenReturn(101L);
    when(mockCompetency1.getCompetency()).thenReturn(mockEntity1);

    // Setup Mock 2
    EmployeeCompetency mockCompetency2 = mock(EmployeeCompetency.class);
    Competency mockEntity2 = mock(Competency.class);
    when(mockEntity2.getId()).thenReturn(102L);
    when(mockCompetency2.getCompetency()).thenReturn(mockEntity2);

    when(mockEmployee.getEmployeeCompetencies())
        .thenReturn(Set.of(mockCompetency1, mockCompetency2));

    // Act
    List<EmployeeCompetencyDto> result = employeeService.getEmployeeCompetencies(employeeId);

    // Assert: Proves the stream processed every single item
    assertNotNull(result);
    assertEquals(2, result.size());
  }

  @Test
  void getEmployeeCompetencies_ShouldBubbleUpExceptionWhenEmployeeNotFound() {
    // Arrange: Simulate the repository failing to find the employee
    when(userRepository.getEmployeeByIdOrThrow(employeeId))
        .thenThrow(new EntityNotFoundException("Employee not found"));

    // Act & Assert
    assertThrows(
        EntityNotFoundException.class, () -> employeeService.getEmployeeCompetencies(employeeId));
  }
}
