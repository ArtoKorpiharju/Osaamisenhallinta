package com.osaamisenhallinta.backend.unit;

import com.osaamisenhallinta.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;

/**
 * Represents a unit in the organization.
 */
@Entity
@Getter
@Table(name = "unit")
public class Unit {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @ManyToMany(mappedBy = "units", fetch = FetchType.LAZY)
  private Set<User> users = new HashSet<>();

  @OneToMany(mappedBy = "supervisedUnit", fetch = FetchType.LAZY)
  private Set<User> supervisors = new HashSet<>();

  protected Unit() {
  }
}
