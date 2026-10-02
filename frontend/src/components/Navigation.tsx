import { NavLink } from 'react-router'

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import SettingsIcon from '@mui/icons-material/Settings'

import { type Role, pagesPerRole } from '../config/roles'

interface NavigationProps {
  role: Role
}

const drawerWidth = 240

export default function Navigation({ role }: NavigationProps) {
  const navigationItems = pagesPerRole[role]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          top: 48,
          height: 'calc(100% - 48px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <List sx={{ flex: 1, px: 1 }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 1,
              '&.active': {
                backgroundColor: '#d6e5f1',
                color: '#174f83',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <List sx={{ px: 1, pb: 1 }}>
        <ListItemButton
          component={NavLink}
          to={`/${role}/settings`}
          sx={{
            borderRadius: 1,
            '&.active': {
              backgroundColor: '#d6e5f1',
              color: '#174f83',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}
