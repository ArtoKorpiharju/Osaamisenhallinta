package com.osaamisenhallinta.qualification;

/** A data transfer object for representing a qualification. */
public record QualificationDto(
    Long qualificationId,
    String qualificationName) {}