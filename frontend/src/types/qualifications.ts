import { type EmployeeQualification } from './overview'

// A qualification with its required competencies.
// Used both in "My Qualifications" and in the "Explore qualifications" catalogue.
export type QualificationDetails = EmployeeQualification

export type CatalogueQualification = Pick<
  EmployeeQualification,
  | 'qualificationId'
  | 'name'
  | 'isCritical'
  | 'requirementsTotal'
  | 'requirementsMet'
  | 'requiredCompetencies'
>
