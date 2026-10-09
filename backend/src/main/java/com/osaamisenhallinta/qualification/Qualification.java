package com.osaamisenhallinta.backend.qualification;

import com.osaamisenhallinta.backend.competency.Competency;
import com.osaamisenhallinta.backend.employee.EmployeeQualification;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "qualification")
public class Qualification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "qualification_requirement",
      joinColumns = @JoinColumn(name = "qualification_id", nullable = false),
      inverseJoinColumns = @JoinColumn(name = "competency_id", nullable = false))
  private Set<Competency> requiredCompetencies = new HashSet<>();

  @OneToMany(mappedBy = "qualification", fetch = FetchType.LAZY)
  private Set<EmployeeQualification> employeeQualifications = new HashSet<>();

  protected Qualification() {
  }

  public Qualification(String name) {
    this.name = name;
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

  public Set<Competency> getRequiredCompetencies() {
    return requiredCompetencies;
  }

  public void addRequiredCompetency(Competency competency) {
    if (requiredCompetencies.add(competency)) {
      competency.getQualifications().add(this);
    }
  }

  public void removeRequiredCompetency(Competency competency) {
    if (requiredCompetencies.remove(competency)) {
      competency.getQualifications().remove(this);
    }
  }

  public Set<EmployeeQualification> getEmployeeQualifications() {
    return employeeQualifications;
  }
}
