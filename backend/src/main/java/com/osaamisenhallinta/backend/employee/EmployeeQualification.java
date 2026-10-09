package com.osaamisenhallinta.backend.employee;

import com.osaamisenhallinta.backend.qualification.Qualification;
import com.osaamisenhallinta.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee_qualification")
public class EmployeeQualification {

  @EmbeddedId
  private EmployeeQualificationId id = new EmployeeQualificationId();

  @MapsId("userId")
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @MapsId("qualificationId")
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "qualification_id", nullable = false)
  private Qualification qualification;

  @Column(name = "favourite", nullable = false)
  private boolean favourite;

  @Column(name = "critical", nullable = false)
  private boolean critical;

  protected EmployeeQualification() {}

  public EmployeeQualification(User user, Qualification qualification) {
    this(user, qualification, false, false);
  }

  public EmployeeQualification(
      User user, Qualification qualification, boolean favourite, boolean critical) {
    this.user = user;
    this.qualification = qualification;
    this.favourite = favourite;
    this.critical = critical;
    if (user != null) {
      user.getEmployeeQualifications().add(this);
    }
    if (qualification != null) {
      qualification.getEmployeeQualifications().add(this);
    }
  }

  public EmployeeQualificationId getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public Qualification getQualification() {
    return qualification;
  }

  public boolean isFavourite() {
    return favourite;
  }

  public void setFavourite(boolean favourite) {
    this.favourite = favourite;
  }

  public boolean isCritical() {
    return critical;
  }

  public void setCritical(boolean critical) {
    this.critical = critical;
  }
}
