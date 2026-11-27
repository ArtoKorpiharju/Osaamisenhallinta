import { fetchApiData } from '../api'
import { isIsoDate, isStringArray, isRecord } from '../../utils/validators'
import {
  type ExpiringCompetency,
  type SupervisorOverview,
} from '../../types/overview'
import {
  isCompetencyStatusApiResponse,
  mapCompetencyStatus,
  type CompetencyStatusApiResponse,
} from '../employee/employee'

interface SupervisorOverviewApiResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  employees: string[]
}

interface ExpiringCompetencyApiResponse {
  employeeId: number
  employeeFirstName: string
  employeeLastName: string
  qualificationId: number
  qualificationName: string
  competencyId: number
  competencyName: string
  expirationDate: string | null
  competencyStatus: CompetencyStatusApiResponse
  renewalDate: string | null
}

// Check if an API response value contains valid supervisor overview.
function isSupervisorOverviewApiResponse(
  value: unknown
): value is SupervisorOverviewApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.email === 'string' &&
    isStringArray(value.employees)
  )
}

// Check if an API response value contains a valid expiring competency.
function isExpiringCompetencyApiResponse(
  value: unknown
): value is ExpiringCompetencyApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.employeeId === 'number' &&
    Number.isInteger(value.employeeId) &&
    typeof value.employeeFirstName === 'string' &&
    typeof value.employeeLastName === 'string' &&
    typeof value.qualificationId === 'number' &&
    Number.isInteger(value.qualificationId) &&
    typeof value.qualificationName === 'string' &&
    typeof value.competencyId === 'number' &&
    Number.isInteger(value.competencyId) &&
    typeof value.competencyName === 'string' &&
    (value.expirationDate === null || isIsoDate(value.expirationDate)) &&
    isCompetencyStatusApiResponse(value.competencyStatus) &&
    (value.renewalDate === null || isIsoDate(value.renewalDate))
  )
}

// Maps an expiring competency from the API response to the frontend
// ExpiringCompetency type.
function mapExpiringCompetency(
  value: ExpiringCompetencyApiResponse
): ExpiringCompetency {
  return {
    employeeId: value.employeeId,
    employeeFirstName: value.employeeFirstName,
    employeeLastName: value.employeeLastName,
    qualificationId: value.qualificationId,
    qualificationName: value.qualificationName,
    competencyId: value.competencyId,
    competencyName: value.competencyName,
    expirationDate: value.expirationDate,
    status: mapCompetencyStatus(value.competencyStatus),
    renewalDate: value.renewalDate,
  }
}

// Fetch the supervisor overview from the backend API.
export async function fetchSupervisorOverview(
  id: number
): Promise<SupervisorOverview> {
  const data = await fetchApiData(`/api/supervisors/${String(id)}/overview`)

  if (!isSupervisorOverviewApiResponse(data)) {
    throw new Error('Invalid supervisor overview data')
  }

  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    employees: data.employees,
  }
}

// Fetch the missing, expired and expiring competencies of critical qualifications
export async function fetchExpiringCompetencies(
  unitId: number
): Promise<ExpiringCompetency[]> {
  const data = await fetchApiData(
    `/api/units/${String(unitId)}/at-risk-critical-qualification-items`
  )

  if (!Array.isArray(data) || !data.every(isExpiringCompetencyApiResponse)) {
    throw new Error('Invalid expiring competencies data')
  }

  return data.map(mapExpiringCompetency)
}
