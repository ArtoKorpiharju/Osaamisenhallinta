package com.osaamisenhallinta.renewal;

import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for managing RenewalPlan entities. */
public interface RenewalPlanRepository extends JpaRepository<RenewalPlan, Long> {}
