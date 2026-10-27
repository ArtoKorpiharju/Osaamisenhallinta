package com.osaamisenhallinta.employee;

import static com.osaamisenhallinta.qualification.QualificationEvaluator.WARNING_DAYS_THRESHOLD;

import com.osaamisenhallinta.competency.Competency;
import com.osaamisenhallinta.competency.CompetencyStatus;
import com.osaamisenhallinta.renewal.RenewalPlan;
import com.osaamisenhallinta.user.User;
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
import lombok.Getter;
import org.springframework.data.annotation.Transient;


/** Represents the relationship between an employee and a competency. */
@Entity
@Getter
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
  private User employee;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "competency_id", nullable = false)
  private Competency competency;

  @Column(name = "issue_date", nullable = false)
  private LocalDate issueDate;

  @Column(name = "expiration_date", nullable = true)
  private LocalDate expirationDate;

  @OneToOne(mappedBy = "employeeCompetency", fetch = FetchType.LAZY)
  private RenewalPlan renewalPlan;

  /** Constructor for creating a new EmployeeCompetency. */
  public EmployeeCompetency(User employee, Competency competency, LocalDate issueDate, LocalDate expirationDate) {
    this.employee = employee;
    this.competency = competency;
    this.issueDate = issueDate;
    this.expirationDate = expirationDate;
  }

  /**
   * Updates the issue and expiration dates of the employee competency.
   *
   * @param newIssueDate The new issue date.
   * @param newExpirationDate The new expiration date.
   */
  public void updateIssueAndExpirationDates(LocalDate newIssueDate, LocalDate newExpirationDate) {
    this.issueDate = newIssueDate;
    this.expirationDate = newExpirationDate;
  }

  /**
   * Sets the renewal plan for the employee competency.
   *
   * @param renewalPlan The renewal plan to be set.
   */
  public void setRenewalPlan(RenewalPlan renewalPlan) {
    this.renewalPlan = renewalPlan;
    if (renewalPlan != null) {
      renewalPlan.setEmployeeCompetency(this);
    }
  }

  /**
   * Removes the bidirectional association between the employee competency and its renewal plan, if it exists.
   * This method ensures that both sides of the relationship are updated to prevent dangling references.
   */
  public void removeRenewalPlan() {
    if (this.renewalPlan != null) {
      this.renewalPlan.setEmployeeCompetency(null);
      this.renewalPlan = null;
    }
  }

  /**
   * Gets the status of the employee competency based on today's date and the expiration date.
   *
   * @return The status of the employee competency.
   */
  @Transient
  public CompetencyStatus getStatus() {
    LocalDate today = LocalDate.now();
    if (this.expirationDate == null) {
      return CompetencyStatus.VALID; // Non-expiring competencies
    }
    
    if (this.expirationDate.isBefore(today)) {
      return CompetencyStatus.EXPIRED;
    }
    
    if (!this.expirationDate.isAfter(today.plusDays(WARNING_DAYS_THRESHOLD))) {
      return CompetencyStatus.EXPIRING_SOON;
    }
    
    return CompetencyStatus.VALID;
  }


  protected EmployeeCompetency() {}
}
