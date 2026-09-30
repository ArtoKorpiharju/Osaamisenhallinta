package com.osaamisenhallinta.backend.user;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Service for generic user related operations, independent of their roles.
 */
@Service
@Transactional(readOnly = true)
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Returns a list of test users for each role. The test users are expected to be created in the
   * database with the email format "test_{role}@email.com".
   *
   * @return List of SeedUserResponseDto containing test users for each role.
   */
  public List<SeedUserResponseDto> getSeedUsers() {
    List<SeedUserResponseDto> testUsers = new ArrayList<>();

    User employee = getFirstUserByRole(UserRole.EMPLOYEE);
    User supervisor = getFirstUserByRole(UserRole.SUPERVISOR);

    User administrator = getFirstUserByRole(UserRole.ADMINISTRATOR);

    testUsers.add(mapToDto(employee));
    testUsers.add(mapToDto(supervisor));
    testUsers.add(mapToDto(administrator));

    return testUsers;
  }

  private User getFirstUserByRole(UserRole role) {
    // 1 test user of each role is created with this email format.
    return userRepository.findByEmail("test_" + role + "@email.com").orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "No test user found for role " + role));
  }

  private SeedUserResponseDto mapToDto(User user) {
    return new SeedUserResponseDto(user.getId(), user.getFirstName(), user.getLastName(),
        user.getRole());
  }
}
