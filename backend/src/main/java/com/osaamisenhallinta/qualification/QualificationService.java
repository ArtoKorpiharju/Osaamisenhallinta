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

  private QualificationDto mapToDto(Qualification qualification) {
    return new QualificationDto(
      qualification.getId(),
      qualification.getName(),
      qualification.getRequiredCompetencies().stream()
        .map(c -> new CompetencyDto(
          c.getId(), 
          c.getName(), 
          String.valueOf(c.getType()), 
          c.getValidityMonths()))
        .toList()
    );
  }

  /** Returns a qualification or reports that the qualification does not exist. */
  public QualificationDto getQualificationById(Long id) {
    return qualificationRepository.findById(id)
        .map(this::mapToDto)
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));
  }
  
  /** Returns all qualifications. */
  public List<QualificationDto> getAllQualifications() {
    return qualificationRepository.findAllQualifications()
      .stream()
      .map(this::mapToDto)
      .toList();
  }
}
