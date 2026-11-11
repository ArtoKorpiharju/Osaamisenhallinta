package com.osaamisenhallinta.unit;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

/** Provides database access for units, allowing for CRUD operations and existence checks by ID. */
public interface UnitRepository extends JpaRepository<Unit, Long> {
  /**
   * Fetches a unit by its ID, or throws an exception if the unit does not exist.
   *
   * @param id the ID of the unit to check
   * @throws EntityNotFoundException if the unit does not exist
   */
  default Unit getByIdOrThrow(Long id) {
    return findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Unit not found with id: " + id));
  }
}
