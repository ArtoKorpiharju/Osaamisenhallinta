import { fetchApiData } from './api'
import { isRecord } from '../utils/validators'
import {
  type Competency,
  type Requirement,
  type Qualification,
  type EmployeeOverview,
  type QualificationStatus,
} from '../types/overview'

type QualificationStatusApiResponse =
  'NOT_QUALIFIED' | 'EXPIRING_SOON' | 'QUALIFIED'

interface CompetencyApiResponse {
  employeeCompetencyId: number
  competencyId: number
  competencyName: string
  competencyType: string
  issueDate: string
  expirationDate: string | null
  status: string
}

interface RequirementApiResponse {
  competencyId: number
  competencyName: string
  competencyType: string
  isMet: boolean
  expirationDate: string | null
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
  requirements: RequirementApiResponse[]
}

interface EmployeeOverviewApiResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'EMPLOYEE'
  competencies: CompetencyApiResponse[]
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

// Check if an API response value contains valid competency.
function isCompetencyApiResponse(
  value: unknown
): value is CompetencyApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.employeeCompetencyId === 'number' &&
    Number.isInteger(value.employeeCompetencyId) &&
    typeof value.competencyId === 'number' &&
    Number.isInteger(value.competencyId) &&
    typeof value.competencyName === 'string' &&
    typeof value.competencyType === 'string' &&
    typeof value.issueDate === 'string' &&
    (typeof value.expirationDate === 'string' ||
      value.expirationDate === null) &&
    typeof value.status === 'string'
  )
}

// Check if an API response value contains valid requirement.
function isRequirementApiResponse(
  value: unknown
): value is RequirementApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.competencyId === 'number' &&
    Number.isInteger(value.competencyId) &&
    typeof value.competencyName === 'string' &&
    typeof value.competencyType === 'string' &&
    typeof value.isMet === 'boolean' &&
    (typeof value.expirationDate === 'string' || value.expirationDate === null)
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
    Array.isArray(value.requirements) &&
    value.requirements.every(isRequirementApiResponse)
  )
}

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

// Maps a competency from the API response to the frontend Competency type.
// Renames API fields to match the frontend model.
function mapCompetency(value: CompetencyApiResponse): Competency {
  return {
    id: value.employeeCompetencyId,
    competencyId: value.competencyId,
    name: value.competencyName,
    type: value.competencyType,
    issueDate: value.issueDate,
    expirationDate: value.expirationDate,
    status: value.status,
  }
}

// Maps a requirement from the API response to the frontend Requirement type.
function mapRequirement(value: RequirementApiResponse): Requirement {
  return {
    competencyId: value.competencyId,
    competencyName: value.competencyName,
    competencyType: value.competencyType,
    isMet: value.isMet,
    expirationDate: value.expirationDate,
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
    requirements: value.requirements.map(mapRequirement),
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
    Array.isArray(value.competencies) &&
    value.competencies.every(isCompetencyApiResponse) &&
    Array.isArray(value.qualifications) &&
    value.qualifications.every(isQualificationApiResponse)
  )
}

// Fetch the employee overview from the backend API.
export async function fetchEmployeeOverview(
  id: number
): Promise<EmployeeOverview> {
  const data = await fetchApiData(`/api/employees/${String(id)}`)

  if (!isEmployeeOverviewApiResponse(data)) {
    throw new Error('Invalid employee overview data')
  }

  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: 'EMPLOYEE',
    competencies: data.competencies.map(mapCompetency),
    qualifications: data.qualifications.map(mapQualification),
  }
}
