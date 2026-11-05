import { fetchApiData } from '../api'
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
