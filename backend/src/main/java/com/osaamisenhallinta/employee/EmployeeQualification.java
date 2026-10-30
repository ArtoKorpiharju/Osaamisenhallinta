package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.qualification.Qualification;
import com.osaamisenhallinta.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;

/** Represents the relationship between an employee and a qualification. */
@Entity
@Getter
@Table(
    name = "employee_qualification",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "qualification_id"}))
public class EmployeeQualification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User employee;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "qualification_id", nullable = false)
  private Qualification qualification;

  @Column(name = "favourite", nullable = false)
  private boolean favourite;

  @Column(name = "critical", nullable = false)
  private boolean critical;

  protected EmployeeQualification() {}
}
