import { fetchApiData } from './api'
import {
  isCompetencyTypeApiResponse,
  mapCompetencyType,
  type CompetencyTypeApiResponse,
} from './employee/employee'
import { isRecord } from '../utils/validators'
import { type CatalogueCompetency } from '../components/Competencies/ExploreCompetencies'

interface CatalogueCompetencyApiResponse {
  competencyId: number
  competencyName: string
  competencyType: CompetencyTypeApiResponse
  validityMonths: number | null
}

function isCatalogueCompetencyApiResponse(
  value: unknown
): value is CatalogueCompetencyApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.competencyId === 'number' &&
    Number.isInteger(value.competencyId) &&
    typeof value.competencyName === 'string' &&
    isCompetencyTypeApiResponse(value.competencyType) &&
    (value.validityMonths === null ||
      value.validityMonths === undefined ||
      (typeof value.validityMonths === 'number' &&
        Number.isInteger(value.validityMonths)))
  )
}

// Fetch all competencies from the backend API.
export async function fetchCompetencies(): Promise<CatalogueCompetency[]> {
  const data = await fetchApiData('/api/competencies')

  if (!Array.isArray(data) || !data.every(isCatalogueCompetencyApiResponse)) {
    throw new Error('Invalid competencies data')
  }

  return data.map((c) => ({
    competencyId: c.competencyId,
    name: c.competencyName,
    type: mapCompetencyType(c.competencyType),
  }))
}