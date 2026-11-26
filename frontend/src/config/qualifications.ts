import { type Tone } from './tones'
import {
  type CompetencyStatus,
  type CompetencyType,
  type QualificationStatus,
} from '../types/overview'

export const statusDisplay: Record<
  QualificationStatus,
  { labelKey: string; tone: Tone }
> = {
  notQualified: { labelKey: 'qualifications.statuses.invalid', tone: 'danger' },
  expired: { labelKey: 'qualifications.statuses.invalid', tone: 'danger' },
  expiringSoon: {
    labelKey: 'qualifications.statuses.expiringSoon',
    tone: 'warning',
  },
  qualified: {
    labelKey: 'qualifications.statuses.qualified',
    tone: 'success',
  },
}

export const competencyStatusDisplay: Record<
  CompetencyStatus,
  { labelKey: string; tone: Tone }
> = {
  expired: {
    labelKey: 'qualifications.competencyStatuses.invalid',
    tone: 'danger',
  },
  missing: {
    labelKey: 'qualifications.competencyStatuses.missing',
    tone: 'danger',
  },
  expiringSoon: {
    labelKey: 'qualifications.competencyStatuses.expiringSoon',
    tone: 'warning',
  },
  valid: {
    labelKey: 'qualifications.competencyStatuses.valid',
    tone: 'success',
  },
}

// Sort order: most urgent first.
export const statusOrder: Record<QualificationStatus, number> = {
  notQualified: 0,
  expired: 0,
  expiringSoon: 1,
  qualified: 2,
}

export const competenceTypeKeys: Record<CompetencyType, string> = {
  training: 'qualifications.competenceTypes.training',
  license: 'qualifications.competenceTypes.license',
  certification: 'qualifications.competenceTypes.certification',
  skill: 'qualifications.competenceTypes.skill',
  other: 'qualifications.competenceTypes.other',
}
