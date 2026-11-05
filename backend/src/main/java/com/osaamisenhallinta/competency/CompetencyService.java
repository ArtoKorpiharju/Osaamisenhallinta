package com.osaamisenhallinta.competency;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


/** Service for managing competency-related operations. */
@Service
public class CompetencyService {
  private final CompetencyRepository competencyRepository;

  public CompetencyService(CompetencyRepository competencyRepository) {
    this.competencyRepository = competencyRepository;
  }

  /**
   * Returns a competency by ID, or throws an exception if not found.
   *
   * @param id The ID of the competency to retrieve.
   * @return An CompetencyDto containing competency details.
   * @throws ResponseStatusException if the competency is not found.
   */
  @Transactional(readOnly = true)
  public CompetencyDto getCompetencyById(Long id) {
    Competency competency = competencyRepository.findById(id)
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Competency not found"));

    CompetencyDto response = mapToDto(competency);
    return response;
  }

  /**
   * Returns all competencies.
   *
   * @return A list of competency DTOs.
   */
  @Transactional(readOnly = true)
  public List<CompetencyDto> getAllCompetencies() {
    return competencyRepository.findAll()
      .stream()
      .map(this::mapToDto)
      .toList();
  }
  
  /**
   * Create a competency, or throws an exception if competency already exists.
   *
   * @param name The name of the competency.
   * @param type The type of the competency.
   * @param validityMonths How long the competency is valid for.
   * @return An CompetencyDto containing competency details.
   * @throws ResponseStatusException if the competency already exists.
   */
  @Transactional
  public CompetencyDto createCompetency(
      String name, CompetencyType type, Integer validityMonths) {

    // Check if following competency already exists in the system
    if (competencyRepository.existsByName(name)) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "Competency already exists");
    }

    // Create a new competency object
    Competency newCompetency = new Competency(name, type, validityMonths);
    newCompetency = competencyRepository.save(newCompetency);
    return mapToDto(newCompetency); 
  }

  /**
   * Deletes a competency, or throws an exception if not found.
   *
   * @param id The ID of the competency to delete.
   * @throws ResponseStatusException if the competency is not found or in use by a qualification.
   */
  @Transactional
  public void deleteCompetency(Long id) {
    Competency competency = competencyRepository.findById(id)
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Competency not found"));

    // Checks whether the competency is used by a Qualification
    if (competencyRepository.isUsedByQualification(id)) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "Competency is in use by a qualification");
    }

    competencyRepository.delete(competency);
  }

  /**
   * Maps a competency entity to a DTO.
   *
   * @param id The ID of the competency.
   * @return A competency DTO.
   */
  private CompetencyDto mapToDto(Competency competency) {
    return new CompetencyDto(
      competency.getId(), 
      competency.getName(), 
      competency.getType(),
      competency.getValidityMonths());
  }
}
