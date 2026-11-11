package com.osaamisenhallinta.qualification;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyRepository;
import com.osaamisenhallinta.competency.dto.CompetencyDto;
import com.osaamisenhallinta.employee.EmployeeQualificationRepository;
import com.osaamisenhallinta.qualification.dto.QualificationDto;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Service for managing qualification-related operations. */
@Service
@RequiredArgsConstructor
public class QualificationService {
  private final QualificationRepository qualificationRepository;
  private final CompetencyRepository competencyRepository;
  private final EmployeeQualificationRepository employeeQualificationRepository;

  /**
   * Returns all qualifications.
   *
   * @return A list of qualification DTOs.
   */
  @Transactional(readOnly = true)
  public List<QualificationDto> getAllQualifications() {
    return qualificationRepository.findAll().stream().map(this::mapToDto).toList();
  }

  /**
   * Returns a qualification by ID, or throws an exception if not found.
   *
   * @param id The ID of the qualification to retrieve.
   * @return An QualificationDto containing qualification details.
   * @throws ResponseStatusException if the qualification is not found.
   */
  @Transactional(readOnly = true)
  public QualificationDto getQualificationById(Long id) {
    return qualificationRepository
        .findById(id)
        .map(this::mapToDto)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));
  }

  /**
   * Create a qualification, or throws an exception if qualification already exists.
   *
   * @param name The name of the qualification.
   * @param requiredCompetenciesIds A list of IDs of the required competencies.
   * @return A QualificationDTO containing qualification details.
   * @throws ResponseStatusException if the qualification already exists.
   */
  @Transactional
  public QualificationDto createQualification(
      String name, List<Long> requiredCompetenciesIds) {
    
    // Check if following qualification already exists in the system
    if (qualificationRepository.existsByName(name)) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "Qualification already exists");
    }

    // Convert the incoming competency IDs into competency entities
    Set<Competency> requiredCompetencies = new HashSet<>(
        competencyRepository.findAllById(requiredCompetenciesIds));

    // Check if all the required competencies were found
    if (requiredCompetencies.size() != new HashSet<>(requiredCompetenciesIds).size()) {
      throw new ResponseStatusException(
        HttpStatus.NOT_FOUND, "One or more competencies not found");
    }

    // Create a new qualification
    Qualification newQualification = new Qualification(name, requiredCompetencies);
    newQualification = qualificationRepository.save(newQualification);
    return mapToDto(newQualification); 
  }

  /**
   * Deletes a qualification, or throws an exception if not found.
   *
   * @param id Qualification ID.
   * @throws ResponseStatusException if the qualification is not found.
   */
  @Transactional
  public void deleteQualification(Long id) {
    // Does qualification exist?
    final Qualification qualification =
        qualificationRepository
          .findById(id)
          .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));

    // When deleting, if the qualification is assigned to employees, 
    // the system must forcefully remove it from all employees first, 
    // and then delete the global qualification

    employeeQualificationRepository.deleteByQualificationId(id);
    qualificationRepository.delete(qualification);
  }

  /**
   * Maps a qualification entity to a DTO.
   *
   * @param id The ID of the qualification.
   * @return A qualification DTO.
   */
  private QualificationDto mapToDto(Qualification qualification) {
    return new QualificationDto(
        qualification.getId(),
        qualification.getName(),
        qualification.getRequiredCompetencies().stream()
            .map(c -> new CompetencyDto(c.getId(), c.getName(), c.getType(), c.getValidityMonths()))
            .toList());
  }
}
