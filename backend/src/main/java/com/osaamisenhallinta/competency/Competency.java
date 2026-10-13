package com.osaamisenhallinta.competency;

import com.osaamisenhallinta.employee.EmployeeCompetency;
import com.osaamisenhallinta.qualification.Qualification;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Represents a competency that an employee can possess.
 */
@Entity
@Getter
@Table(name = "competency")
public class Competency {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "type", nullable = false, columnDefinition = "competency_type")
  private CompetencyType type;

  @Column(name = "validity_months", nullable = true)
  private Integer validityMonths;

  @ManyToMany(mappedBy = "requiredCompetencies", fetch = FetchType.LAZY)
  private Set<Qualification> qualifications = new HashSet<>();

  @OneToMany(mappedBy = "competency", fetch = FetchType.LAZY)
  private Set<EmployeeCompetency> employeeCompetencies = new HashSet<>();

  protected Competency() {
  }
}
