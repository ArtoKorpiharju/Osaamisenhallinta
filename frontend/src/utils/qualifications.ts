import { statusOrder } from '../config/qualifications'
import { type CatalogueApiResponse } from '../services/qualifications'
import { mapCompetencyType } from '../services/employee/employee'
import {
  type EmployeeCompetency,
  type EmployeeQualification,
} from '../types/overview'
import { type CatalogueQualification } from '../types/qualifications'

// Qualifications without an expiry date go last.
const NO_EXPIRY = '9999-12-31'

// Critical first, then most urgent status, earliest expiry, and name.
export const compareQualifications = <T extends EmployeeQualification>(
  a: T,
  b: T
) =>
  Number(b.isCritical) - Number(a.isCritical) ||
  statusOrder[a.status] - statusOrder[b.status] ||
  (a.validUntil ?? NO_EXPIRY).localeCompare(b.validUntil ?? NO_EXPIRY) ||
  a.name.localeCompare(b.name)

export function buildCatalogue(
  catalogue: readonly CatalogueApiResponse[],
  employeeCompetencies: readonly EmployeeCompetency[],
  myQualifications: readonly EmployeeQualification[]
): CatalogueQualification[] {
  const owned = new Map(employeeCompetencies.map((c) => [c.competencyId, c]))
  const criticalIds = new Set(
    myQualifications.filter((q) => q.isCritical).map((q) => q.qualificationId)
  )

  return catalogue.map((qualification): CatalogueQualification => {
    const requiredCompetencies = qualification.requiredCompetencies.map(
      (c): EmployeeCompetency =>
        owned.get(c.competencyId) ?? {
          employeeCompetencyId: null,
          competencyId: c.competencyId,
          name: c.competencyName,
          type: mapCompetencyType(c.competencyType),
          issueDate: null,
          expirationDate: null,
          status: 'missing',
          renewalPlan: null,
        }
    )

    return {
      qualificationId: qualification.qualificationId,
      name: qualification.qualificationName,
      isCritical: criticalIds.has(qualification.qualificationId),
      requirementsTotal: requiredCompetencies.length,
      requirementsMet: requiredCompetencies.filter(
        (c) => c.status === 'valid' || c.status === 'expiringSoon'
      ).length,
      requiredCompetencies,
    }
  })
}
