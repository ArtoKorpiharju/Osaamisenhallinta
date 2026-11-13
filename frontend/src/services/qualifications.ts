import { fetchApiData } from './api'
import { isRecord } from '../utils/validators'
import {
  isCompetencyTypeApiResponse,
  type CompetencyTypeApiResponse,
} from './employee/employee'

export interface CatalogueApiResponse {
  qualificationId: number
  qualificationName: string
  requiredCompetencies: {
    competencyId: number
    competencyName: string
    competencyType: CompetencyTypeApiResponse
  }[]
}

function isCatalogueCompetency(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.competencyId === 'number' &&
    Number.isInteger(value.competencyId) &&
    typeof value.competencyName === 'string' &&
    isCompetencyTypeApiResponse(value.competencyType)
  )
}

function isCatalogueApiResponse(value: unknown): value is CatalogueApiResponse {
  return (
    isRecord(value) &&
    typeof value.qualificationId === 'number' &&
    Number.isInteger(value.qualificationId) &&
    typeof value.qualificationName === 'string' &&
    Array.isArray(value.requiredCompetencies) &&
    value.requiredCompetencies.every(isCatalogueCompetency)
  )
}

// Fetch all qualifications from the backend API.
export async function fetchQualificationCatalogue(): Promise<
  CatalogueApiResponse[]
> {
  const data = await fetchApiData('/api/qualifications')

  if (!Array.isArray(data) || !data.every(isCatalogueApiResponse)) {
    throw new Error('Invalid qualification catalogue data')
  }

  return data
}
