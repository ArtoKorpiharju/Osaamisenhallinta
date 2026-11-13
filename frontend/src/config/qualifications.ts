import { type Tone } from './tones'
import {
  type CompetencyStatus,
  type CompetencyType,
  type QualificationStatus,
} from '../types/overview'

export const statusDisplay: Record<
  QualificationStatus,
  { label: string; tone: Tone }
> = {
  notQualified: { label: 'Invalid', tone: 'danger' },
  expired: { label: 'Invalid', tone: 'danger' },
  expiringSoon: { label: 'Expiring soon', tone: 'warning' },
  qualified: { label: 'Qualified', tone: 'success' },
}

export const competencyStatusDisplay: Record<
  CompetencyStatus,
  { label: string; tone: Tone }
> = {
  expired: { label: 'Invalid', tone: 'danger' },
  missing: { label: 'Missing', tone: 'danger' },
  expiringSoon: { label: 'Expiring soon', tone: 'warning' },
  valid: { label: 'Valid', tone: 'success' },
}

// Sort order: most urgent first.
export const statusOrder: Record<QualificationStatus, number> = {
  notQualified: 0,
  expired: 0,
  expiringSoon: 1,
  qualified: 2,
}

export const competenceTypeLabels: Record<CompetencyType, string> = {
  training: 'Training',
  license: 'License',
  certification: 'Certification',
  skill: 'Skill',
  other: 'Other',
}
