package com.osaamisenhallinta.qualification;

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

  /** Returns a qualification or reports that the qualification does not exist. */
  public QualificationDto getQualificationById(Long id) {
    Qualification qualification = qualificationRepository.findById(id)
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));

    QualificationDto response = mapToDto(qualification);
    return response;
  }

  public List<QualificationDto> getAllQualifications() {
    return qualificationRepository.findAllQualifications();
  }

  private QualificationDto mapToDto(Qualification qualification) {
    return new QualificationDto(
      qualification.getId(),
      qualification.getName());
  }
}
