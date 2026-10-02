package com.osaamisenhallinta.backend.user;

/** A DTO for representing a test user. */
public record SeedUserResponseDto(Long id, String firstName, String lastName, UserRole role) {
}
