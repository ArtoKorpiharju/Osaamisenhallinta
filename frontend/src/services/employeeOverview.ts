import { fetchApiData } from './api'
import { isRecord } from '../utils/validators'
import {
  type Competency,
  type Qualification,
  type EmployeeOverview,
  type QualificationStatus,
  type RenewalPlan,
  type CompetencyStatus,
} from '../types/overview'

type QualificationStatusApiResponse =
  'NOT_QUALIFIED' | 'EXPIRING_SOON' | 'QUALIFIED'

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

interface QualificationApiResponse {
  employeeQualificationId: number
  qualificationId: number
  qualificationName: string
  favourite: boolean
  critical: boolean
  validUntil: string | null
  status: QualificationStatusApiResponse
  totalRequirementsCount: number
  metRequirementsCount: number
  requiredCompetencies: CompetencyApiResponse[]
}

interface EmployeeOverviewApiResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'EMPLOYEE'
  qualifications: QualificationApiResponse[]
}

// Check if an API response value contains valid qualification status.
function isQualificationStatusApiResponse(
  value: unknown
): value is QualificationStatusApiResponse {
  return (
    value === 'NOT_QUALIFIED' ||
    value === 'EXPIRING_SOON' ||
    value === 'QUALIFIED'
  )
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

// Check if an API response value contains valid qualification.
function isQualificationApiResponse(
  value: unknown
): value is QualificationApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.employeeQualificationId === 'number' &&
    Number.isInteger(value.employeeQualificationId) &&
    typeof value.qualificationId === 'number' &&
    Number.isInteger(value.qualificationId) &&
    typeof value.qualificationName === 'string' &&
    typeof value.favourite === 'boolean' &&
    typeof value.critical === 'boolean' &&
    (typeof value.validUntil === 'string' || value.validUntil === null) &&
    isQualificationStatusApiResponse(value.status) &&
    typeof value.totalRequirementsCount === 'number' &&
    Number.isInteger(value.totalRequirementsCount) &&
    typeof value.metRequirementsCount === 'number' &&
    Number.isInteger(value.metRequirementsCount) &&
    Array.isArray(value.requiredCompetencies) &&
    value.requiredCompetencies.every(isCompetencyApiResponse)
  )
}

// Maps a qualification status from the API response to the frontend
// QualificationStatus type.
function mapQualificationStatus(
  status: QualificationStatusApiResponse
): QualificationStatus {
  switch (status) {
    case 'NOT_QUALIFIED':
      return 'notQualified'
    case 'EXPIRING_SOON':
      return 'expiringSoon'
    case 'QUALIFIED':
      return 'qualified'
  }
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

// Maps a qualification from the API response to the frontend Qualification type.
// Renames API fields to match the frontend model and provides default values
// for fields that the API does not currently return.
function mapQualification(value: QualificationApiResponse): Qualification {
  return {
    id: value.employeeQualificationId,
    qualificationId: value.qualificationId,
    name: value.qualificationName,
    isFavourite: value.favourite,
    isCritical: value.critical,
    validUntil: value.validUntil,
    status: mapQualificationStatus(value.status),
    requirementsTotal: value.totalRequirementsCount,
    requirementsMet: value.metRequirementsCount,
    requiredCompetencies: value.requiredCompetencies.map(mapCompetency),
  }
}

// Check if an API response value contains valid employee overview.
function isEmployeeOverviewApiResponse(
  value: unknown
): value is EmployeeOverviewApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.email === 'string' &&
    value.role === 'EMPLOYEE' &&
    Array.isArray(value.qualifications) &&
    value.qualifications.every(isQualificationApiResponse)
  )
}

// Fetch the employee overview from the backend API.
export async function fetchEmployeeOverview(
  id: number
): Promise<EmployeeOverview> {
  const data = await fetchApiData(`/api/employees/${String(id)}/overview`)

  if (!isEmployeeOverviewApiResponse(data)) {
    throw new Error('Invalid employee overview data')
  }

  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: 'EMPLOYEE',
    qualifications: data.qualifications.map(mapQualification),
  }
}
