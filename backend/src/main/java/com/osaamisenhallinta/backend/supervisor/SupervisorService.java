package com.osaamisenhallinta.backend.supervisor;

import com.osaamisenhallinta.backend.user.User;
import com.osaamisenhallinta.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Service for managing supervisor-related operations.
 */
@Service
@Transactional(readOnly = true)
public class SupervisorService {
  private final UserRepository userRepository;

  public SupervisorService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /** Returns a user or reports that the user does not exist. */
  public SupervisorOverviewDto getSupervisorById(Long id) {
    User supervisor = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    SupervisorOverviewDto response = mapToDto(supervisor);
    return response;
  }

  private SupervisorOverviewDto mapToDto(User supervisor) {
    String[] mockUnit = {"Jessie", "James"}; // Placeholder for actual credentials

    return new SupervisorOverviewDto(supervisor.getId(), supervisor.getFirstName(),
        supervisor.getLastName(), supervisor.getEmail(), mockUnit);
  }
}
