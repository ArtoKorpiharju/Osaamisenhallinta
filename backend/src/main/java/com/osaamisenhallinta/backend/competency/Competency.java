package com.osaamisenhallinta.backend.competency;

import com.osaamisenhallinta.backend.employee.EmployeeCompetency;
import com.osaamisenhallinta.backend.qualification.Qualification;
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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "competency")
public class Competency {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "type", nullable = false, columnDefinition = "credential_type")
  private CredentialType type;

  @Column(name = "validity_months", nullable = true)
  private Integer validityMonths;

  @ManyToMany(mappedBy = "requiredCompetencies", fetch = FetchType.LAZY)
  private Set<Qualification> qualifications = new HashSet<>();

  @OneToMany(mappedBy = "competency", fetch = FetchType.LAZY)
  private Set<EmployeeCompetency> employeeCompetencies = new HashSet<>();

  protected Competency() {
  }

  public Competency(String name, CredentialType type, Integer validityMonths) {
    this.name = name;
    this.type = type;
    this.validityMonths = validityMonths;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public CredentialType getType() {
    return type;
  }

  public void setType(CredentialType type) {
    this.type = type;
  }

  public Integer getValidityMonths() {
    return validityMonths;
  }

  public void setValidityMonths(Integer validityMonths) {
    this.validityMonths = validityMonths;
  }

  public Set<Qualification> getQualifications() {
    return qualifications;
  }

  public Set<EmployeeCompetency> getEmployeeCompetencies() {
    return employeeCompetencies;
  }
}
