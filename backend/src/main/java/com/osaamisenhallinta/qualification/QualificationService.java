package com.osaamisenhallinta.qualification;

import org.springframework.stereotype.Service;

/** Service for managing qualification-related operations. */
@Service
public class QualificationService {
  private final QualificationRepository qualificationRepository;

  // Constructor
  public QualificationService(QualificationRepository qualificationRepository) {
    this.qualificationRepository = qualificationRepository;
  }
}
