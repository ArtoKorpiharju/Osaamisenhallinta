import { fetchApiData } from './api'
import { isRecord } from '../utils/validators'
import {
  type Competency,
  type Qualification,
  type EmployeeOverview,
} from '../types/overview'

interface QualificationApiResponse {
  employeeQualificationId: number
  qualificationId: number
  qualificationName: string
  favourite: boolean
  critical: boolean
}

interface CompetencyApiResponse {
  employeeCompetencyId: number
  competencyId: number
  competencyName: string
  competencyType: string
  issueDate: string
  expirationDate: string | null
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
    typeof value.critical === 'boolean'
  )
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
    status: 'qualified', // Edit this once the API returns it
    requirementsMet: 0, // Edit this once the API returns it
    requirementsTotal: 0, // Edit this once the API returns it
    validUntil: '2027-12-31', // Edit this once the API returns it
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
