package com.osaamisenhallinta.competency;

import org.springframework.data.jpa.repository.JpaRepository;

/** A repository for managing global competency data. */
public interface CompetencyRepository extends JpaRepository<Competency, Long> {}
