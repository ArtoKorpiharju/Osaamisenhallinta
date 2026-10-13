import { fetchApiData } from './api'
import { isStringArray } from '../utils/validators'

export interface SupervisorOverview {
  id: number
  firstName: string
  lastName: string
  email: string
  employees: string[]
}

// Check if a value is a SupervisorOverview object.
function isSupervisorOverview(value: unknown): value is SupervisorOverview {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const supervisor = value as Record<string, unknown>

  return (
    typeof supervisor.id === 'number' &&
    Number.isInteger(supervisor.id) &&
    typeof supervisor.firstName === 'string' &&
    typeof supervisor.lastName === 'string' &&
    typeof supervisor.email === 'string' &&
    isStringArray(supervisor.employees)
  )
}

// Fetch the supervisor overview from the backend API.
export async function fetchSupervisorOverview(
  id: number
): Promise<SupervisorOverview> {
  const data = await fetchApiData(`/api/supervisors/${String(id)}/overview`)

  if (!isSupervisorOverview(data)) {
    throw new Error('Invalid supervisor overview data')
  }

  return data
}
