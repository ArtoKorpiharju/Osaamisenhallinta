import { fetchApiData } from './api'
import { isRecord } from '../utils/validators'
import { type CompetencyType } from '../types/overview'
import { type CatalogueCompetency } from '../components/Competencies/ExploreCompetencies'

type CompetencyTypeApiResponse =
  'TRAINING' | 'LICENSE' | 'CERTIFICATION' | 'SKILL' | 'OTHER'

interface CatalogueCompetencyApiResponse {
  competencyId: number
  competencyName: string
  competencyType: CompetencyTypeApiResponse
  validityMonths: number | null
}

function isCompetencyTypeApiResponse(
  value: unknown
): value is CompetencyTypeApiResponse {
  return (
    value === 'TRAINING' ||
    value === 'LICENSE' ||
    value === 'CERTIFICATION' ||
    value === 'SKILL' ||
    value === 'OTHER'
  )
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

const typeMap: Record<CompetencyTypeApiResponse, CompetencyType> = {
  TRAINING: 'training',
  LICENSE: 'license',
  CERTIFICATION: 'certification',
  SKILL: 'skill',
  OTHER: 'other',
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
    type: typeMap[c.competencyType],
  }))
}