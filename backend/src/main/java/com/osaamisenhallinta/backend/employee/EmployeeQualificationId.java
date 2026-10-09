package com.osaamisenhallinta.backend.employee;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class EmployeeQualificationId implements Serializable {

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "qualification_id", nullable = false)
  private Long qualificationId;

  public EmployeeQualificationId() {}

  public EmployeeQualificationId(Long userId, Long qualificationId) {
    this.userId = userId;
    this.qualificationId = qualificationId;
  }

  public Long getUserId() {
    return userId;
  }

  public Long getQualificationId() {
    return qualificationId;
  }

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof EmployeeQualificationId that)) {
      return false;
    }
    return Objects.equals(userId, that.userId)
        && Objects.equals(qualificationId, that.qualificationId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId, qualificationId);
  }
}
