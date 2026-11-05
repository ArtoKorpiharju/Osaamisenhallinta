package com.osaamisenhallinta.employee;

import com.osaamisenhallinta.employee.dto.EmployeeQualificationDto;
import com.osaamisenhallinta.employee.mapper.EmployeeQualificationMapper;
import com.osaamisenhallinta.qualification.Qualification;
import com.osaamisenhallinta.qualification.QualificationEvaluationResult;
import com.osaamisenhallinta.qualification.QualificationEvaluator;
import com.osaamisenhallinta.qualification.QualificationRepository;
import com.osaamisenhallinta.user.User;
import com.osaamisenhallinta.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Service class for managing employee qualifications. */
@Service
@RequiredArgsConstructor
public class EmployeeQualificationService {

  private final UserRepository userRepository;
  private final QualificationRepository qualificationRepository;
  private final EmployeeQualificationRepository employeeQualificationRepository;
  private final QualificationEvaluator qualificationEvaluator;

  /** Assigns a new qualification to an employee profile. */
  @Transactional
  public EmployeeQualificationDto assignQualification(
      Long employeeId, Long qualificationId, boolean isCritical) {
    // TODO IN FUTURE: Add authorization check to ensure that only supervisor can pass the
    // isCritical flag as true.
    User employee = userRepository.getEmployeeByIdOrThrow(employeeId);

    Qualification qualification = qualificationRepository.getByIdOrThrow(qualificationId);

    if (employeeQualificationRepository.existsByEmployeeIdAndQualificationId(
        employeeId, qualificationId)) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Employee already holds this qualification");
    }

    EmployeeQualification assignment =
        new EmployeeQualification(employee, qualification, isCritical);

    EmployeeQualification savedAssignment = employeeQualificationRepository.save(assignment);

    QualificationEvaluationResult result =
        qualificationEvaluator.evaluateQualification(
            qualification, employee.getEmployeeCompetencies());

    return EmployeeQualificationMapper.toEmployeeQualificationDto(savedAssignment, result);
  }

  /** Removes an assigned qualification from an employee's profile. */
  @Transactional
  public void removeQualification(Long employeeId, Long employeeQualificationId) {
    EmployeeQualification assignment =
        employeeQualificationRepository.getByEmployeeIdAndEmployeeQualificationIdOrThrow(
            employeeId, employeeQualificationId);

    if (assignment.isCritical()) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Cannot remove a critical qualification from an employee");
    }

    employeeQualificationRepository.delete(assignment);
  }

  /** Toggles the boolean favourite status of an assigned qualification. */
  @Transactional
  public void toggleQualificationFavourite(
      Long employeeId, Long employeeQualificationId, Boolean favourite) {
    EmployeeQualification assignment =
        employeeQualificationRepository.getByEmployeeIdAndEmployeeQualificationIdOrThrow(
            employeeId, employeeQualificationId);

    assignment.setFavourite(favourite);

    employeeQualificationRepository.save(assignment);

    return;
  }
}
