import { type Tone } from './tones'
import { type QualificationStatus } from '../types/overview'
import { type CompetenceType } from '../types/qualifications'
 
export const statusDisplay: Record<QualificationStatus, { label: string; tone: Tone }> =
  {
    expired: { label: 'Invalid', tone: 'danger' },
    expiring: { label: 'Expiring soon', tone: 'warning' },
    qualified: { label: 'Qualified', tone: 'success' },
  }
 
// Sort order: most urgent first.
export const statusOrder: Record<QualificationStatus, number> = {
  expired: 0,
  expiring: 1,
  qualified: 2,
}
 
export const competenceTypeLabels: Record<CompetenceType, string> = {
  training: 'Training',
  certification: 'Certification',
}