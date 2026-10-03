package com.osaamisenhallinta.backend.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Database access for users. */
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);
}
