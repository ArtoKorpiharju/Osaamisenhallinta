import { fetchApiData } from '../api'
import { isStringArray, isRecord } from '../../utils/validators'
import { type SupervisorOverview } from '../../types/overview'

interface SupervisorOverviewApiResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  employees: string[]
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
    lastName: data.firstName,
    email: data.email,
    employees: data.employees,
  }
}
