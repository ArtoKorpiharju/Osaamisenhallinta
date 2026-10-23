import { type Tone } from '../config/tones'

export type QualificationStatus = 'expired' | 'expiring' | 'qualified'

export interface Qualification {
  id: number // id = employeeQualificationId in backend
  qualificationId: number
  name: string
  isFavourite: boolean // Star symbol in table if favourite
  isCritical: boolean
  status: QualificationStatus
  requirementsMet: number
  requirementsTotal: number
  validUntil: string
}

export interface Competency {
  id: number // id = employeeCompetencyId in backend
  competencyId: number
  name: string
  type: string
  issueDate: string
  expirationDate: string | null
}

export interface EmployeeOverview {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'EMPLOYEE'
  competencies: Competency[]
  qualifications: Qualification[]
}

export interface SupervisorOverview {
  id: number
  firstName: string
  lastName: string
  email: string
  employees: string[]
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
