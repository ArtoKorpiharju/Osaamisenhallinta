package com.osaamisenhallinta.qualification;

import com.osaamisenhallinta.competency.CompetencyDto;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Service for managing qualification-related operations. */
@Service
@Transactional(readOnly = true)
public class QualificationService {
  private final QualificationRepository qualificationRepository;

  // Constructor
  public QualificationService(QualificationRepository qualificationRepository) {
    this.qualificationRepository = qualificationRepository;
  }

  /**
   * Returns all qualifications.
   *
   * @return A list of qualification DTOs.
   */
  public List<QualificationDto> getAllQualifications() {
    return qualificationRepository.findAll()
      .stream()
      .map(this::mapToDto)
      .toList();
  }

  /**
   * Returns a qualification by ID, or throws an exception if not found.
   *
   * @param id The ID of the qualification to retrieve.
   * @return An QualificationDto containing qualification details.
   * @throws ResponseStatusException if the qualification is not found.
   */
  public QualificationDto getQualificationById(Long id) {
    return qualificationRepository.findById(id)
        .map(this::mapToDto)
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));
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
        .map(c -> new CompetencyDto(
          c.getId(), 
          c.getName(), 
          c.getType(), 
          c.getValidityMonths()))
        .toList()
    );
  }
}
