package com.osaamisenhallinta.supervisor;

import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import com.osaamisenhallinta.user.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Service for managing supervisor-related operations. */
@Service
@Transactional(readOnly = true)
public class SupervisorService {
  private final UserRepository userRepository;

  public SupervisorService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /** Returns a user or reports that the user does not exist. */
  public SupervisorOverviewDto getSupervisorById(Long id) {
    User supervisor =
        userRepository
            .findById(id)
            .filter(user -> user.getRole() == UserRole.SUPERVISOR)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supervisor not found"));

    SupervisorOverviewDto response = mapToDto(supervisor);
    return response;
  }

  private SupervisorOverviewDto mapToDto(User supervisor) {
    String[] mockUnit = {"Jessie", "James"}; // Placeholder for actual credentials

    return new SupervisorOverviewDto(
        supervisor.getId(),
        supervisor.getFirstName(),
        supervisor.getLastName(),
        supervisor.getEmail(),
        mockUnit);
  }
}
