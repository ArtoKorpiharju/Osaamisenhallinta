package com.osaamisenhallinta.competency;

import org.springframework.data.jpa.repository.JpaRepository;

/** Database access for competency information. */
public interface CompetencyRepository extends JpaRepository<Competency, Long> {
    // Voi kirjoittaa SQL koodia => yksi db haku
}
