import { type CompetencyType } from '../../types/overview'
import { isRecord } from '../../utils/validators'

export type CompetencyTypeApiResponse =
  'TRAINING' | 'LICENSE' | 'CERTIFICATION' | 'SKILL' | 'OTHER'

interface CompetencyApiResponse {
  competencyId: number
  competencyName: string
  competencyType: CompetencyTypeApiResponse
  validityMonths: number | null
}

export interface AdminCompetency {
  id: number
  name: string
  type: CompetencyType
  validityMonths: number | null
}

export interface CreateAdminCompetencyInput {
  name: string
  type: CompetencyType
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

export function isCompetencyApiResponse(
  value: unknown
): value is CompetencyApiResponse {
  if (!isRecord(value)) return false

  return (
    typeof value.competencyId === 'number' &&
    Number.isInteger(value.competencyId) &&
    typeof value.competencyName === 'string' &&
    isCompetencyTypeApiResponse(value.competencyType) &&
    (value.validityMonths === null ||
      (typeof value.validityMonths === 'number' &&
        Number.isInteger(value.validityMonths)))
  )
}

function mapCompetencyType(type: CompetencyTypeApiResponse): CompetencyType {
  switch (type) {
    case 'TRAINING':
      return 'training'
    case 'LICENSE':
      return 'license'
    case 'CERTIFICATION':
      return 'certificate'
    case 'SKILL':
      return 'skill'
    case 'OTHER':
      return 'other'
  }
}

export function mapCompetencyTypeToApi(
  type: CreateAdminCompetencyInput['type']
): CompetencyTypeApiResponse {
  switch (type) {
    case 'training':
      return 'TRAINING'
    case 'license':
      return 'LICENSE'
    case 'certificate':
      return 'CERTIFICATION'
    case 'skill':
      return 'SKILL'
    case 'other':
      return 'OTHER'
  }
}

export function mapCompetency(value: CompetencyApiResponse): AdminCompetency {
  return {
    id: value.competencyId,
    name: value.competencyName,
    type: mapCompetencyType(value.competencyType),
    validityMonths: value.validityMonths,
  }
}
