import { Alert, Box } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

import Navigation from '../components/Navigation'
import TopBar from '../components/TopBar'

import { type Role, roles, pagesPerRole } from '../config/roles'
import { fetchSeedUsers, type SeedUser } from '../services/seedUsers'

// Get the role from the current path.
// If the path doesn't match any role, default to employee.
function getRoleFromPath(pathname: string): Role {
  if (pathname.startsWith('/supervisor')) {
    return 'supervisor'
  }

  if (pathname.startsWith('/admin')) {
    return 'admin'
  }

  return 'employee'
}

// Get the path for a given role based on the current path.
// Keep the current section if available to the new role. Otherwise use overview.
function getRolePath(role: Role, pathname: string): string {
  const section = pathname.split('/')[2] || 'overview'
  const destinationSection = pagesPerRole[role].some((page) =>
    page.path.endsWith(`/${section}`)
  )
    ? section
    : 'overview'

  return `/${role}/${destinationSection}`
}

// Get the seed user for a given role from the list of seed users.
function getUserForRole(
  seedUsers: SeedUser[],
  role: Role
): SeedUser | undefined {
  const apiRole = roles.find((r) => r.value === role)?.apiRole
  const user = seedUsers.find((user) => user.role === apiRole)

  return user
}

// Get the user name for a given role from the seed users.
function getUserNameForRole(
  seedUsers: SeedUser[],
  role: Role
): string | undefined {
  const user = getUserForRole(seedUsers, role)

  if (!user) return undefined

  return `${user.firstName} ${user.lastName}`
}

// The root layout component that wraps the entire application.
export default function RootLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const role = getRoleFromPath(location.pathname)

  const [navigationOpen, setNavigationOpen] = useState(true)
  const [seedUsers, setSeedUsers] = useState<SeedUser[]>([])
  const [usersError, setUsersError] = useState<string | null>(null)
  const [usersLoading, setUsersLoading] = useState(true)

  // Fetch seed users on component mount.
  useEffect(() => {
    fetchSeedUsers()
      .then(setSeedUsers)
      .catch((err: unknown) => {
        setUsersError(
          err instanceof Error ? err.message : 'Could not load users'
        )
      })
      .finally(() => {
        setUsersLoading(false)
      })
  }, [])

  // Handle role change by navigating to the corresponding path for the new role.
  const handleRoleChange = (newRole: Role) => {
    if (usersLoading || usersError) {
      return
    }

    const user = getUserForRole(seedUsers, newRole)

    if (!user) {
      setUsersError(`No seed user found for role ${newRole}`)
      return
    }

    setUsersError(null)
    void navigate(getRolePath(newRole, location.pathname))
  }

  // Render the layout with TopBar, Navigation, and main content area.
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <TopBar
        role={role}
        onRoleChange={handleRoleChange}
        navigationOpen={navigationOpen}
        onToggleNavigation={() => {
          setNavigationOpen((open) => !open)
        }}
        userName={getUserNameForRole(seedUsers, role)}
      />

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {navigationOpen && <Navigation role={role} />}

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 1,
            pl: 3,
            pr: 3,
            overflow: 'auto',
          }}
        >
          {/** Display an error alert if there was an error fetching seed users. */}
          {usersError && <Alert severity="error">{usersError}</Alert>}

          {/** Display an info alert while seed users are being fetched. */}
          {usersLoading && <Alert severity="info">Fetching seed users…</Alert>}
          <Outlet
            context={{
              userId: getUserForRole(seedUsers, role)?.id,
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
