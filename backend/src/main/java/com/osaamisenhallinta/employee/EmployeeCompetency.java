package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.competency.Competency;
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
}
