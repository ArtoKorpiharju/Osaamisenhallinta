import { fetchApiData } from '../api'
import { isRecord } from '../../utils/validators'
import { type EmployeeOverview } from '../../types/overview'
import {
  isQualificationApiResponse,
  mapQualification,
  type QualificationApiResponse,
} from './employee'

interface EmployeeOverviewApiResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'EMPLOYEE'
  qualifications: QualificationApiResponse[]
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
