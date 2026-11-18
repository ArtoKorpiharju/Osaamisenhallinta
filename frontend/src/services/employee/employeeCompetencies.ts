import { fetchApiData, sendApiRequest  } from '../api'
import { type EmployeeCompetency } from '../../types/overview'
import { isCompetencyApiResponse, mapCompetency } from './employee'

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

// Remove a competency from the employee.
// DELETE /api/employees/{employeeId}/competencies/{employeeCompetencyId}
export async function deleteEmployeeCompetency(
  employeeId: number,
  employeeCompetencyId: number
): Promise<void> {
  await sendApiRequest(
    `/api/employees/${String(employeeId)}/competencies/${String(employeeCompetencyId)}`,
    'DELETE'
  )
}
