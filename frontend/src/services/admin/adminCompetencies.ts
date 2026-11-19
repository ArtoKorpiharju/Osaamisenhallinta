import { fetchApiData } from '../api'
import {
  type AdminCompetency,
  type CreateAdminCompetencyInput,
  isCompetencyApiResponse,
  mapCompetency,
  mapCompetencyTypeToApi,
} from './admin'

// Fetch the competencies from the backend API.
export async function fetchAdminCompetencies(): Promise<AdminCompetency[]> {
  const data = await fetchApiData('/api/competencies')

  if (!Array.isArray(data) || !data.every(isCompetencyApiResponse)) {
    throw new Error('Invalid competencies data')
  }

  return data.map(mapCompetency)
}

// Fetch and validate a competency by ID.
export async function fetchCompetency(id: number): Promise<AdminCompetency> {
  const data = await fetchApiData(`/api/competencies/${String(id)}`)

  if (!isCompetencyApiResponse(data)) {
    throw new Error('Invalid competency data')
  }

  return mapCompetency(data)
}

// Create a competency and validate the response.
export async function createCompetency(
  competency: CreateAdminCompetencyInput
): Promise<AdminCompetency> {
  const data = await fetchApiData('/api/competencies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: competency.name,
      type: mapCompetencyTypeToApi(competency.type),
      validityMonths: competency.validityMonths,
    }),
  })

  if (!isCompetencyApiResponse(data)) {
    throw new Error('Invalid competency data')
  }

  return mapCompetency(data)
}

// Delete a competency by ID.
export async function deleteCompetency(id: number): Promise<void> {
  await fetchApiData(`/api/competencies/${String(id)}`, {
    method: 'DELETE',
  })
}
