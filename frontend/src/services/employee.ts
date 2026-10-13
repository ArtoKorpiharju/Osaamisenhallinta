import { fetchApiData } from './api'
import { isStringArray } from '../utils/validators'

export interface EmployeeOverview {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'EMPLOYEE'
  credentials: string[]
  qualifications: string[]
}

// Check if a value is an EmployeeOverview object.
function isEmployeeOverview(value: unknown): value is EmployeeOverview {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const employee = value as Record<string, unknown>

  return (
    typeof employee.id === 'number' &&
    Number.isInteger(employee.id) &&
    typeof employee.firstName === 'string' &&
    typeof employee.lastName === 'string' &&
    typeof employee.email === 'string' &&
    employee.role === 'EMPLOYEE' &&
    isStringArray(employee.credentials) &&
    isStringArray(employee.qualifications)
  )
}

// Fetch the employee overview from the backend API.
export async function fetchEmployeeOverview(
  id: number
): Promise<EmployeeOverview> {
  const data = await fetchApiData(`/api/employees/${String(id)}`)

  if (!isEmployeeOverview(data)) {
    throw new Error('Invalid employee overview data')
  }

  return data
}
