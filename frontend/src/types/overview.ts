import { type Tone } from '../config/tones'

export type QualificationStatus = 'notQualified' | 'expiringSoon' | 'qualified'

export type CompetencyStatus = 'expired' | 'missing' | 'expiringSoon' | 'valid'

export interface RenewalPlan {
  id: number
  employeeCompetencyId: number
  renewalDate: string
  renewalComment: string | null
}

export interface Competency {
  id: number | null // id = employeeCompetencyId in backend
  competencyId: number
  name: string
  type: string
  issueDate: string | null
  expirationDate: string | null
  status: string
  renewalPlan: RenewalPlan | null
}

export interface Requirement {
  competencyId: number
  competencyName: string
  competencyType: string
  isMet: boolean
  expirationDate: string | null
}

export interface Qualification {
  id: number // id = employeeQualificationId in backend
  qualificationId: number
  name: string
  isFavourite: boolean // Star symbol in table if favourite
  isCritical: boolean
  validUntil: string | null
  status: QualificationStatus
  requirementsTotal: number
  requirementsMet: number
  requiredCompetencies: Competency[]
}

export interface EmployeeOverview {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'EMPLOYEE'
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
  missingRenewals: number
  plannedRenewals: number
}

export interface ActionRequiredItem {
  id: string
  title: string
  dueDate: string
  status: { label: string; tone: Tone }
  actions: { id: string; label: string }[]
  note?: { text: string; tone: 'danger' | 'info' }
}
