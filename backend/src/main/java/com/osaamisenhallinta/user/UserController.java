package com.osaamisenhallinta.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A controller for generic users independent of their roles. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Endpoints for generic user operations independent of role")
public class UserController {
  private final UserService userService;

  @Operation(
      summary = "Get seed users",
      description = "Retrieves a list of predefined seed users. "
          + "These are used for changing the user role in development phase.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved seed users")
      })
  @GetMapping("/seed-users")
  public List<SeedUserResponseDto> getSeedUsers() {
    return userService.getSeedUsers();
  }
}
