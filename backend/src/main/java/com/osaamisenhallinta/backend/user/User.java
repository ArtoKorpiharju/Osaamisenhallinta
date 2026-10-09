package com.osaamisenhallinta.backend.user;

import com.osaamisenhallinta.backend.unit.Unit;
import com.osaamisenhallinta.backend.employeecompetency.EmployeeCompetency;
import com.osaamisenhallinta.backend.employeequalification.EmployeeQualification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;


/** Basic user information stored in PostgreSQL. */
@Entity
@Getter
@Table(name = "app_user")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @Column(name = "email", nullable = false, length = 255, unique = true)
  private String email;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "system_role", nullable = false, columnDefinition = "user_role")
  private UserRole role;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "employee_unit",
      joinColumns = @JoinColumn(name = "employee_id", nullable = false),
      inverseJoinColumns = @JoinColumn(name = "unit_id", nullable = false))
  private Set<Unit> units = new HashSet<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinTable(name = "supervisor_unit", joinColumns = @JoinColumn(name = "supervisor_id"),
      inverseJoinColumns = @JoinColumn(name = "unit_id"))
  private Unit supervisedUnit;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private Set<EmployeeCompetency> employeeCompetencies = new HashSet<>();

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private Set<EmployeeQualification> employeeQualifications = new HashSet<>();

  protected User() {
  }
}
