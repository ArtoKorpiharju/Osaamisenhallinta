import { type Tone } from '../config/tones'

export type QualificationStatus =
  | 'expired'
  | 'requirements_incomplete'
  | 'qualified'

export interface Qualification {
  id: string
  name: string
  status: QualificationStatus
  requirementsMet: number
  requirementsTotal: number
  validUntil: string
  // Star symbol in table if primary
  isPrimary?: boolean
}

export interface OverviewSummary {
  outdated: number
  expiring: number
  renewals: number
  planned: number
}

export interface ActionRequiredItem {
  id: string
  title: string
  dueDate: string
  status: { label: string; tone: Tone }
  actions: { id: string; label: string }[]
  note?: { text: string; tone: 'danger' | 'info' }
}
