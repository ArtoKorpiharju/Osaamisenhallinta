package com.osaamisenhallinta.user;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for generic users independent of their roles. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  @GetMapping("/seed-users")
  public List<SeedUserResponseDto> getSeedUsers() {
    return userService.getSeedUsers();
  }
}
