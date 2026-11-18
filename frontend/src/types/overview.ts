import { type Tone } from '../config/tones'

export type QualificationStatus = 'notQualified' | 'expiringSoon' | 'qualified'

export type CompetencyStatus = 'expired' | 'missing' | 'expiringSoon' | 'valid'

export type CompetencyType =
  'training' | 'license' | 'certification' | 'skill' | 'other'

export interface RenewalPlan {
  id: number
  employeeCompetencyId: number
  renewalDate: string
  renewalComment: string | null
}

export interface EmployeeCompetency {
  employeeCompetencyId: number | null
  competencyId: number
  name: string
  type: CompetencyType
  issueDate: string | null
  expirationDate: string | null
  status: CompetencyStatus
  renewalPlan: RenewalPlan | null
}

export interface Requirement {
  competencyId: number
  competencyName: string
  competencyType: string
  isMet: boolean
  expirationDate: string | null
}

export interface EmployeeQualification {
  employeeQualificationId: number
  qualificationId: number
  name: string
  isFavourite: boolean // Star symbol in table if favourite
  isCritical: boolean
  validUntil: string | null
  status: QualificationStatus
  requirementsTotal: number
  requirementsMet: number
  requiredCompetencies: EmployeeCompetency[]
}

export interface EmployeeOverview {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'EMPLOYEE'
  qualifications: EmployeeQualification[]
}

export interface SupervisorOverview {
  id: number
  firstName: string
  lastName: string
  email: string
  employees: string[]
}

export interface UnitPerson {
  id: number
  firstName: string
  lastName: string
}

export interface UnitOverview {
  unitId: number
  unitName: string
  supervisors: UnitPerson[]
  employees: UnitPerson[]
}

export interface UnitEmployeeQualifications {
  employee: UnitPerson
  qualifications: EmployeeQualification[]
  competencies: EmployeeCompetency[]
}

export interface UnitDetails {
  supervisors: UnitPerson[]
  employees: UnitEmployeeQualifications[]
}

export interface ExpiringCompetency {
  employeeId: number
  employeeFirstName: string
  employeeLastName: string
  qualificationId: number
  qualificationName: string
  competencyId: number
  competencyName: string
  expirationDate: string | null
  status: CompetencyStatus
  renewalDate: string | null
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
