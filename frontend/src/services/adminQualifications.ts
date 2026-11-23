import { fetchApiData } from './api'

export interface RequiredCompetency {
  competencyId: number
  competencyName: string
}

export interface AdminQualification {
  qualificationId: number
  qualificationName: string
  requiredCompetencies: RequiredCompetency[]
}

function isRequiredCompetency(value: unknown): value is RequiredCompetency {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const competency = value as Record<string, unknown>

  return (
    typeof competency.competencyId === 'number' &&
    typeof competency.competencyName === 'string'
  )
}

function isAdminQualification(value: unknown): value is AdminQualification {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const qualification = value as Record<string, unknown>

  return (
    typeof qualification.qualificationId === 'number' &&
    typeof qualification.qualificationName === 'string' &&
    Array.isArray(qualification.requiredCompetencies) &&
    qualification.requiredCompetencies.every(isRequiredCompetency)
  )
}

export async function fetchAdminQualifications(): Promise<AdminQualification[]> {
  const data = await fetchApiData('/api/qualifications')

  if (!Array.isArray(data) || !data.every(isAdminQualification)) {
    throw new Error('Invalid qualifications data')
  }

  return data
}

export async function fetchQualificationCompetencies(): Promise<
  RequiredCompetency[]
> {
  const data = await fetchApiData('/api/competencies')

  if (!Array.isArray(data) || !data.every(isRequiredCompetency)) {
    throw new Error('Invalid competencies data')
  }

  return data
}

export async function fetchAdminQualification(
  qualificationId: string,
): Promise<AdminQualification> {
  const data = await fetchApiData(
    `/api/qualifications/${encodeURIComponent(qualificationId)}`,
  )

  if (!isAdminQualification(data)) {
    throw new Error('Invalid qualification data')
  }

  return data
}