package com.osaamisenhallinta.backend.supervisor;

/**
 * Supervisor overview information returned by the REST API. Does not include heavy information such
 * as employee specific information
 */
public record SupervisorOverviewDto(
    Long id,
    String firstName,
    String lastName,
    String email,
    String[] employees) {
}
