import { statusOrder } from '../config/qualifications'
import { type Qualification } from '../types/overview'
 
// Critical first, then most urgent status, earliest expiry, and name.
export const compareQualifications = <T extends Qualification>(a: T, b: T) =>
  Number(b.isCritical === true) - Number(a.isCritical === true) ||
  statusOrder[a.status] - statusOrder[b.status] ||
  a.validUntil.localeCompare(b.validUntil) ||
  a.name.localeCompare(b.name)
 