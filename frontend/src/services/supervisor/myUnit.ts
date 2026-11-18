import { fetchApiData } from '../api'
import { isRecord } from '../../utils/validators'
import { type UnitDetails, type UnitOverview } from '../../types/overview'
import { fetchEmployeeQualifications } from '../employee/employeeQualifications'
import { fetchEmployeeCompetencies } from '../employee/employeeCompetencies'

interface UnitSupervisorApiResponse {
  id: number
  firstName: string
  lastName: string
}

interface UnitEmployeeApiResponse {
  employeeId: number
  employeeFirstName: string
  employeeLastName: string
}

interface UnitOverviewApiResponse {
  unitId: number
  unitName: string
  supervisors: UnitSupervisorApiResponse[]
  employees: UnitEmployeeApiResponse[]
}

// Check if an API response value contains a valid unit supervisor.
function isUnitSupervisorApiResponse(
  value: unknown
): value is UnitSupervisorApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string'
  )
}

// Check if an API response value contains a valid unit employee.
function isUnitEmployeeApiResponse(
  value: unknown
): value is UnitEmployeeApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.employeeId === 'number' &&
    Number.isInteger(value.employeeId) &&
    typeof value.employeeFirstName === 'string' &&
    typeof value.employeeLastName === 'string'
  )
}

// Check if an API response value contains a valid unit overview.
function isUnitOverviewApiResponse(
  value: unknown
): value is UnitOverviewApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.unitId === 'number' &&
    Number.isInteger(value.unitId) &&
    typeof value.unitName === 'string' &&
    Array.isArray(value.supervisors) &&
    value.supervisors.every(isUnitSupervisorApiResponse) &&
    Array.isArray(value.employees) &&
    value.employees.every(isUnitEmployeeApiResponse)
  )
}

// Fetch the unit's name, supervisors and employees from the backend API.
export async function fetchUnitOverview(unitId: number): Promise<UnitOverview> {
  const data = await fetchApiData(`/api/units/${String(unitId)}/overview`)

  if (!isUnitOverviewApiResponse(data)) {
    throw new Error('Invalid unit overview data')
  }

  return {
    unitId: data.unitId,
    unitName: data.unitName,
    supervisors: data.supervisors.map((supervisor) => ({
      id: supervisor.id,
      firstName: supervisor.firstName,
      lastName: supervisor.lastName,
    })),
    employees: data.employees.map((employee) => ({
      id: employee.employeeId,
      firstName: employee.employeeFirstName,
      lastName: employee.employeeLastName,
    })),
  }
}

// Fetch the unit's supervisors and employees, employee's
// qualifications and competencies from the backend API.
export async function fetchUnitDetails(unitId: number): Promise<UnitDetails> {
  const unit = await fetchUnitOverview(unitId)

  const employees = await Promise.all(
    unit.employees.map(async (employee) => {
      const [qualifications, competencies] = await Promise.all([
        fetchEmployeeQualifications(employee.id),
        fetchEmployeeCompetencies(employee.id),
      ])

      return { employee, qualifications, competencies }
    })
  )

  return { supervisors: unit.supervisors, employees }
}
