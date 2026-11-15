import { type Tone } from './tones'
import { type CompetencyStatus, type CompetencyType } from '../types/overview'

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
export const competencyStatusOrder: Record<CompetencyStatus, number> = {
  expired: 0,
  missing: 1,
  expiringSoon: 2,
  valid: 3,
}

export const competencyTypeLabels: Record<CompetencyType, string> = {
  training: 'Training',
  license: 'License',
  certification: 'Certification',
  skill: 'Skill',
  other: 'Other',
}