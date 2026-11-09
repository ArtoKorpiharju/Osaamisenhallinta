import { type Qualification, type QualificationStatus } from './overview'

export type CompetenceType = 'training' | 'certification'

export interface Competence {
  id: string
  name: string
  type: CompetenceType
  status: QualificationStatus
  validUntil: string
  issuedBy: string
  description: string
  // Short text shown in the detail dialog instead of the description.
  summary?: string
  // ISO date of the planned renewal, missing or null if not planned.
  plannedRenewal?: string | null
  isCritical?: boolean
}

// A qualification with its required competences.
// Used both in "My Qualifications" and in the "Explore qualifications" catalogue.
export interface QualificationDetails extends Qualification {
  competences: Competence[]
}
