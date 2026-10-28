package com.osaamisenhallinta.qualification;

import org.springframework.data.jpa.repository.JpaRepository;

/** Database access for qualifications. */
public interface QualificationRepository extends JpaRepository<Qualification, Long> {
    
}
