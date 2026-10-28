package com.osaamisenhallinta.competency;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for competency information. */
@RestController
@RequestMapping("/api/competencies")
public class CompetencyController {
  private final CompetencyService competencyService;

  public CompetencyController(CompetencyService competencyService) {
    this.competencyService = competencyService;
  }
}
