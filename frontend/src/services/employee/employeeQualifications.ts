import { fetchApiData } from '../api'
import { type EmployeeQualification } from '../../types/overview'
import { isQualificationApiResponse, mapQualification } from './employee'

// Fetch the employee qualifications from the backend API.
export async function fetchEmployeeQualifications(
  id: number
): Promise<EmployeeQualification[]> {
  const data = await fetchApiData(`/api/employees/${String(id)}/qualifications`)

  if (!Array.isArray(data) || !data.every(isQualificationApiResponse)) {
    throw new Error('Invalid employee qualifications data')
  }

  return data.map(mapQualification)
}
