import { Box } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useState } from 'react'

import Navigation from '../components/Navigation'
import TopBar from '../components/TopBar'

import { type Role, pagesPerRole } from '../config/roles'

// Get the role from the current path.
// If the path doesn't match any role, default to employee.
function getRoleFromPath(pathname: string): Role {
  if (pathname.startsWith('/manager')) {
    return 'manager'
  }

  if (pathname.startsWith('/admin')) {
    return 'admin'
  }

  return 'employee'
}

// Get the path for a given role based on the current path.
// Keep shared settings or the current section if available to the new role.
// Otherwise use overview.
function getRolePath(role: Role, pathname: string): string {
  const section = pathname.split('/')[2] || 'overview'
  const destinationSection =
    section === 'settings' ||
    pagesPerRole[role].some((page) => page.path.endsWith(`/${section}`))
      ? section
      : 'overview'

  return `/${role}/${destinationSection}`
}

export default function RootLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [navigationOpen, setNavigationOpen] = useState(true)

  const role = getRoleFromPath(location.pathname)

  const handleRoleChange = (newRole: Role) => {
    void navigate(getRolePath(newRole, location.pathname))
  }

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
      />

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {navigationOpen && (
          <Navigation role={role} />
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 1,
            pl: 3,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
