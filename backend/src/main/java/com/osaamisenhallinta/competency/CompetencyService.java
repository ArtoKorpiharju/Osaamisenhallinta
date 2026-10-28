package com.osaamisenhallinta.competency;

import org.springframework.stereotype.Service;

/** Service for managing competency-related operations. */
@Service
public class CompetencyService {
  private final CompetencyRepository competencyRepository;

  public CompetencyService(CompetencyRepository competencyRepository) {
    this.competencyRepository = competencyRepository;
  }

}
