package com.osaamisenhallinta.qualification;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for qualification information. */
@RestController
@RequestMapping("/api/qualifications")
public class QualificationController {
  private final QualificationService qualificationService;

  // Constructor
  public QualificationController(QualificationService qualificationService) {
    this.qualificationService = qualificationService;
  }
  
}
