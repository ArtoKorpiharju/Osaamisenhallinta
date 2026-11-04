import { roles, type ApiRole } from '../config/roles'
import { fetchApiData } from './api'

export interface SeedUser {
  id: number
  firstName: string
  lastName: string
  role: ApiRole
}

// Check if a value is a SeedUser object.
function isSeedUser(value: unknown): value is SeedUser {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const seedUser = value as Record<string, unknown>

  return (
    typeof seedUser.id === 'number' &&
    Number.isInteger(seedUser.id) &&
    typeof seedUser.firstName === 'string' &&
    typeof seedUser.lastName === 'string' &&
    typeof seedUser.role === 'string' &&
    roles.some((role) => role.apiRole === seedUser.role)
  )
}

// Fetch the seed users from the backend API.
export async function fetchSeedUsers(): Promise<SeedUser[]> {
  const data = await fetchApiData('/api/users/seed-users')

  // Validate the fetched data to ensure it is an array of SeedUser objects.
  if (!Array.isArray(data) || !data.every(isSeedUser)) {
    throw new Error('Invalid seed users data')
  }

  return data
}
