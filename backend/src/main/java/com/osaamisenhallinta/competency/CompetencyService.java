package com.osaamisenhallinta.competency;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


/** Service for managing competency-related operations. */
@Service
@Transactional(readOnly = true)
public class CompetencyService {
  private final CompetencyRepository competencyRepository;

  public CompetencyService(CompetencyRepository competencyRepository) {
    this.competencyRepository = competencyRepository;
  }

  /** Returns a competency. */
  /*public CompetencyDto getCompetencyById(Long id) {
    Competency competency = competencyRepository.findById(id)
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Competency not found"));

    CompetencyDto response = mapToDto(competency);
    return response;
  }*/

  /** Return all competencies as DTOs. */
  public List<CompetencyDto> getAllCompetencies() {
    return competencyRepository.getAllCompetencies();
  }

  /** Map to a DTO. */
  /* 
  private CompetencyDto mapToDto(Competency competency) {
    return new CompetencyDto(
      competency.getId(), 
      competency.getName(), 
      competency.getType(),
      competency.getValidityMonths());
  }
      */
}
