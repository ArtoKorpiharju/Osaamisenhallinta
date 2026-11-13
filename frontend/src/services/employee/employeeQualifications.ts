import { fetchApiData, sendApiRequest } from '../api'
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

export async function assignQualification(
  employeeId: number,
  qualificationId: number
): Promise<EmployeeQualification> {
  const data = await sendApiRequest(
    `/api/employees/${String(employeeId)}/qualifications`,
    'POST',
    { qualificationId }
  )

  if (!isQualificationApiResponse(data)) {
    throw new Error('Invalid assigned qualification data')
  }

  return mapQualification(data)
}

// Remove an assigned qualification. The backend rejects critical ones with 403.
export async function deleteEmployeeQualification(
  employeeId: number,
  employeeQualificationId: number
): Promise<void> {
  await sendApiRequest(
    `/api/employees/${String(employeeId)}/qualifications/${String(employeeQualificationId)}`,
    'DELETE'
  )
}

// Update the favourite flag of an assigned qualification.
export async function updateQualificationFavourite(
  employeeId: number,
  employeeQualificationId: number,
  favourite: boolean
): Promise<void> {
  await sendApiRequest(
    `/api/employees/${String(employeeId)}/qualifications/${String(employeeQualificationId)}/favourite`,
    'PATCH',
    { favourite }
  )
}
