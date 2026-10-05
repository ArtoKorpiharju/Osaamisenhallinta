package com.osaamisenhallinta.backend.user;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for generic users independent of their roles. */
@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/seed-users")
  public List<SeedUserResponseDto> getSeedUsers() {
    return userService.getSeedUsers();
  }

}
