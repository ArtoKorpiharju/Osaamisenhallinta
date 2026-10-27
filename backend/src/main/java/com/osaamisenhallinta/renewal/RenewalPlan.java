package com.osaamisenhallinta.renewal;

import com.osaamisenhallinta.employee.EmployeeCompetency;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;

/** Represents a plan for renewing an employee's competency. */
@Entity
@Getter 
@Table(name = "renewal_plan")
public class RenewalPlan {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "employee_competency_id", nullable = false, unique = true)
  private EmployeeCompetency employeeCompetency;

  @Column(name = "renewal_date", nullable = false)
  private LocalDate renewalDate;

  @Column(name = "renewal_comment", nullable = true, length = 500)
  private String renewalComment;

  /** Constructor for creating a new RenewalPlan. */
  public RenewalPlan(LocalDate renewalDate, String renewalComment) {
    this.renewalDate = renewalDate;
    this.renewalComment = renewalComment;
  }

  public void setEmployeeCompetency(EmployeeCompetency employeeCompetency) {
    this.employeeCompetency = employeeCompetency;
  }

  public void update(LocalDate renewalDate, String renewalComment) {
    this.renewalDate = renewalDate;
    this.renewalComment = renewalComment;
  }

  protected RenewalPlan() {}
}
