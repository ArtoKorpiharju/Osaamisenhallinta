import { type CompetencyType } from './overview'

// A competency from the whole system catalogue (not only the employee's own).
export interface CatalogueCompetency {
  competencyId: number
  name: string
  type: CompetencyType
}