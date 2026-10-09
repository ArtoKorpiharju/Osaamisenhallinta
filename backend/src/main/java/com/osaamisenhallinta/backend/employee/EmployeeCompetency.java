package com.osaamisenhallinta.backend.employee;

import com.osaamisenhallinta.backend.competency.Competency;
import com.osaamisenhallinta.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;

@Entity
@Table(
    name = "employee_competency",
    uniqueConstraints =
        @UniqueConstraint(
            name = "uq_employee_competency_user_competency",
            columnNames = {"user_id", "competency_id"}))
public class EmployeeCompetency {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "competency_id", nullable = false)
  private Competency competency;

  @Column(name = "issue_date", nullable = false)
  private LocalDate issueDate;

  @Column(name = "expiration_date", nullable = true)
  private LocalDate expirationDate;

  @OneToOne(mappedBy = "employeeCompetency", fetch = FetchType.LAZY)
  private RenewalPlan renewalPlan;

  protected EmployeeCompetency() {}

  public EmployeeCompetency(
      User user, Competency competency, LocalDate issueDate, LocalDate expirationDate) {
    setUser(user);
    setCompetency(competency);
    this.issueDate = issueDate;
    this.expirationDate = expirationDate;
  }

  public Long getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    if (this.user != null) {
      this.user.getEmployeeCompetencies().remove(this);
    }
    this.user = user;
    if (user != null) {
      user.getEmployeeCompetencies().add(this);
    }
  }

  public Competency getCompetency() {
    return competency;
  }

  public void setCompetency(Competency competency) {
    if (this.competency != null) {
      this.competency.getEmployeeCompetencies().remove(this);
    }
    this.competency = competency;
    if (competency != null) {
      competency.getEmployeeCompetencies().add(this);
    }
  }

  public LocalDate getIssueDate() {
    return issueDate;
  }

  public void setIssueDate(LocalDate issueDate) {
    this.issueDate = issueDate;
  }

  public LocalDate getExpirationDate() {
    return expirationDate;
  }

  public void setExpirationDate(LocalDate expirationDate) {
    this.expirationDate = expirationDate;
  }

  public RenewalPlan getRenewalPlan() {
    return renewalPlan;
  }

  public void setRenewalPlan(RenewalPlan renewalPlan) {
    this.renewalPlan = renewalPlan;
  }
}
