import { useState } from 'react'

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LanguageIcon from '@mui/icons-material/Language'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'

import { type Role, roles } from '../config/roles'
import { type Language, languages } from '../config/languages'

interface TopBarProps {
  role: Role
  onRoleChange: (role: Role) => void
  navigationOpen: boolean
  onToggleNavigation: () => void
}

export default function TopBar({
  role,
  onRoleChange,
  navigationOpen,
  onToggleNavigation,
}: TopBarProps) {
  const currentRoleLabel =
    roles.find((item) => item.value === role)?.label ?? role

  const [language, setLanguage] = useState<Language>('en')
  const [languageAnchor, setLanguageAnchor] = useState<HTMLElement | null>(null)
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const [switchRoleAnchor, setSwitchRoleAnchor] = useState<HTMLElement | null>(
    null
  )

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid #e0e3e8' }}
    >
      <Toolbar sx={{ minHeight: '48px !important' }}>
        <IconButton
          onClick={onToggleNavigation}
          sx={{
            ml: -1.25,
            mr: 1.25,
            color: 'text.secondary',
          }}
        >
          {navigationOpen ? (
            <CloseIcon fontSize="medium" />
          ) : (
            <MenuIcon fontSize="medium" />
          )}
        </IconButton>

        <Typography
          sx={{
            flex: 1,
            color: '#174f83',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          Osaamisenhallinta
        </Typography>

        <Button
          onClick={(event) => {
            setLanguageAnchor(event.currentTarget)
          }}
          sx={{
            minWidth: 64,
            color: 'text.secondary',
            textTransform: 'none',
            gap: 0.5,
          }}
        >
          <LanguageIcon fontSize="small" /> {language.toUpperCase()}
        </Button>
        <Menu
          anchorEl={languageAnchor}
          open={Boolean(languageAnchor)}
          onClose={() => {
            setLanguageAnchor(null)
          }}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.value}
              selected={language === lang.value}
              onClick={() => {
                setLanguage(lang.value)
                setLanguageAnchor(null)
              }}
            >
              <ListItemText primary={lang.label} />
            </MenuItem>
          ))}
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Button
          onClick={(event) => {
            setProfileAnchor(event.currentTarget)
          }}
          sx={{ color: '#174f83', textTransform: 'none', gap: 1 }}
        >
          <Avatar
            sx={{
              width: 26,
              height: 26,
              bgcolor: '#d8e6f3',
              color: '#174f83',
              fontSize: 13,
            }}
          ></Avatar>
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
              Matti Mattinen
            </Typography>
            <Typography
              sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1.2 }}
            >
              {currentRoleLabel}
            </Typography>
          </Box>
          <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
        </Button>

        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => {
            setProfileAnchor(null)
          }}
        >
          <MenuItem
            onClick={() => {
              setProfileAnchor(null)
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Show profile" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setProfileAnchor(null)
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={(event) => {
              setSwitchRoleAnchor(event.currentTarget)
            }}
          >
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText primary="Switch role" />
          </MenuItem>
        </Menu>
        {/* Keep role choices in a separate popup anchored to the switch-role item. */}
        <Menu
          anchorEl={switchRoleAnchor}
          open={Boolean(switchRoleAnchor)}
          onClose={() => {
            setSwitchRoleAnchor(null)
          }}
        >
          {roles.map((item) => (
            <MenuItem
              key={item.value}
              selected={role === item.value}
              onClick={() => {
                onRoleChange(item.value)
                setSwitchRoleAnchor(null)
                setProfileAnchor(null)
              }}
            >
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
