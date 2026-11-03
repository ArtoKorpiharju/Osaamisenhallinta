import { fetchApiData } from './api'
import { isRecord } from '../utils/validators'
import {
  type Competency,
  type RenewalPlan,
  type CompetencyStatus,
} from '../types/overview'

type CompetencyStatusApiResponse =
  'EXPIRED' | 'MISSING' | 'EXPIRING_SOON' | 'VALID'

interface RenewalPlanApiResponse {
  id: number
  employeeCompetencyId: number
  renewalDate: string
  renewalComment: string | null
}

interface CompetencyApiResponse {
  employeeCompetencyId: number | null
  competencyId: number
  competencyName: string
  competencyType: string
  issueDate: string | null
  expirationDate: string | null
  status: CompetencyStatusApiResponse
  renewalPlan: RenewalPlanApiResponse | null
}

// Check if an API response value contains valid competency status.
function isCompetencyStatusApiResponse(
  value: unknown
): value is CompetencyStatusApiResponse {
  return (
    value === 'EXPIRED' ||
    value === 'MISSING' ||
    value === 'EXPIRING_SOON' ||
    value === 'VALID'
  )
}

// Check if an API response value contains valid renewal plan
function isRenewalPlanApiResponse(
  value: unknown
): value is RenewalPlanApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.employeeCompetencyId === 'number' &&
    Number.isInteger(value.employeeCompetencyId) &&
    typeof value.renewalDate === 'string' &&
    (typeof value.renewalComment === 'string' || value.renewalComment === null)
  )
}

// Check if an API response value contains valid competency.
function isCompetencyApiResponse(
  value: unknown
): value is CompetencyApiResponse {
  if (!isRecord(value)) return false

  return (
    ((typeof value.employeeCompetencyId === 'number' &&
      Number.isInteger(value.employeeCompetencyId)) ||
      value.employeeCompetencyId === null) &&
    typeof value.competencyId === 'number' &&
    Number.isInteger(value.competencyId) &&
    typeof value.competencyName === 'string' &&
    typeof value.competencyType === 'string' &&
    (typeof value.issueDate === 'string' || value.issueDate === null) &&
    (typeof value.expirationDate === 'string' ||
      value.expirationDate === null) &&
    isCompetencyStatusApiResponse(value.status) &&
    (value.renewalPlan === null || isRenewalPlanApiResponse(value.renewalPlan))
  )
}

// Maps a qualification status from the API response to the frontend
// QualificationStatus type.
function mapCompetencyStatus(
  status: CompetencyStatusApiResponse
): CompetencyStatus {
  switch (status) {
    case 'EXPIRED':
      return 'expired'
    case 'MISSING':
      return 'missing'
    case 'EXPIRING_SOON':
      return 'expiringSoon'
    case 'VALID':
      return 'valid'
  }
}

// Maps a renewal plan from the API response to the frontend RenewalPlan type.
function mapRenewalPlan(value: RenewalPlanApiResponse): RenewalPlan {
  return {
    id: value.id,
    employeeCompetencyId: value.employeeCompetencyId,
    renewalDate: value.renewalDate,
    renewalComment: value.renewalComment,
  }
}

// Maps a competency from the API response to the frontend Competency type.
// Renames API fields to match the frontend model.
function mapCompetency(value: CompetencyApiResponse): Competency {
  return {
    id: value.employeeCompetencyId,
    competencyId: value.competencyId,
    name: value.competencyName,
    type: value.competencyType,
    issueDate: value.issueDate ?? null,
    expirationDate: value.expirationDate ?? null,
    status: mapCompetencyStatus(value.status),
    renewalPlan:
      value.renewalPlan === null ? null : mapRenewalPlan(value.renewalPlan),
  }
}

// Fetch the employee competencies from the backend API.
export async function fetchEmployeeCompetencies(
  id: number
): Promise<Competency[]> {
  const data = await fetchApiData(`/api/employees/${String(id)}/competencies`)

  if (!Array.isArray(data) || !data.every(isCompetencyApiResponse)) {
    throw new Error('Invalid employee competencies data')
  }

  return data.map(mapCompetency)
}
