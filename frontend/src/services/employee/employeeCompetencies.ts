import { fetchApiData, sendApiRequest  } from '../api'
import { type EmployeeCompetency, type RenewalPlan } from '../../types/overview'
import {
  isCompetencyApiResponse,
  isRenewalPlanApiResponse,
  mapCompetency,
  mapRenewalPlan,
} from './employee'

export interface RenewalPlanRequest {
  // ISO date (YYYY-MM-DD)
  renewalDate: string
  renewalComment: string | null
}

// Fetch the employee competencies from the backend API.
export async function fetchEmployeeCompetencies(
  id: number
): Promise<EmployeeCompetency[]> {
  const data = await fetchApiData(`/api/employees/${String(id)}/competencies`)

  if (!Array.isArray(data) || !data.every(isCompetencyApiResponse)) {
    throw new Error('Invalid employee competencies data')
  }

  return data.map(mapCompetency)
}

// Create or update (upsert) the renewal plan of an employee competency.
export async function saveRenewalPlan(
  employeeId: number,
  employeeCompetencyId: number,
  plan: RenewalPlanRequest
): Promise<RenewalPlan> {
  const data = await sendApiRequest(
    `/api/employees/${String(employeeId)}/competencies/${String(employeeCompetencyId)}/renewal-plan`,
    'PUT',
    plan
  )

  if (!isRenewalPlanApiResponse(data)) {
    throw new Error('Invalid renewal plan data')
  }

  return mapRenewalPlan(data)
}

export async function deleteRenewalPlan(
  employeeId: number,
  employeeCompetencyId: number
): Promise<void> {
  await sendApiRequest(
      `/api/employees/${String(employeeId)}/competencies/${String(employeeCompetencyId)}/renewal-plan`,
    'DELETE'
  )
}

export async function deleteEmployeeCompetency(
  employeeId: number,
  employeeCompetencyId: number
): Promise<void> {
  await sendApiRequest(
    `/api/employees/${String(employeeId)}/competencies/${String(employeeCompetencyId)}`,
    'DELETE'
  )
}

// Renew a competency the employee already has: new issue date,
// the backend recalculates the expiration date.
export async function updateCompetencyIssueDate(
  employeeId: number,
  employeeCompetencyId: number,
  issueDate: string
): Promise<EmployeeCompetency> {
  const data = await sendApiRequest(
    `/api/employees/${String(employeeId)}/competencies/${String(employeeCompetencyId)}`,
    'PUT',
    { issueDate }
  )

  if (!isCompetencyApiResponse(data)) {
    throw new Error('Invalid employee competency data')
  }

  return mapCompetency(data)
}

// Give the employee a competency they do not have yet (status "missing").
export async function assignCompetency(
  employeeId: number,
  competencyId: number,
  issueDate: string
): Promise<EmployeeCompetency> {
  const data = await sendApiRequest(
    `/api/employees/${String(employeeId)}/competencies`,
    'POST',
    { competencyId, issueDate }
  )

  if (!isCompetencyApiResponse(data)) {
    throw new Error('Invalid assigned competency data')
  }

  return mapCompetency(data)
}
