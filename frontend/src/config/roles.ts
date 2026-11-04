import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import HistoryIcon from '@mui/icons-material/History'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export const roles = [
  { value: 'employee', label: 'Employee', apiRole: 'EMPLOYEE' },
  { value: 'supervisor', label: 'Supervisor', apiRole: 'SUPERVISOR' },
  { value: 'admin', label: 'Admin', apiRole: 'ADMINISTRATOR' },
] as const

export type Role = (typeof roles)[number]['value']
export type ApiRole = (typeof roles)[number]['apiRole']

interface Page {
  labelKey: string // Translation key for the page label
  path: string // The path of the page used for routing.
  icon: ComponentType<SvgIconProps> // The icon of the page displayed in the navigation menu.
}

export const pagesPerRole: Record<Role, Page[]> = {
  employee: [
    {
      labelKey: 'navigation.overview',
      path: '/employee/overview',
      icon: HomeOutlinedIcon,
    },
    {
      labelKey: 'navigation.qualifications',
      path: '/employee/qualifications',
      icon: CheckBoxIcon,
    },
    {
      labelKey: 'navigation.competencies',
      path: '/employee/competencies',
      icon: StarBorderIcon,
    },
    {
      labelKey: 'navigation.renewals',
      path: '/employee/renewals',
      icon: EventRepeatIcon,
    },
  ],
  supervisor: [
    {
      labelKey: 'navigation.overview',
      path: '/supervisor/overview',
      icon: HomeOutlinedIcon,
    },
    {
      labelKey: 'navigation.renewals',
      path: '/supervisor/renewals',
      icon: EventRepeatIcon,
    },
  ],
  admin: [
    {
      labelKey: 'navigation.overview',
      path: '/admin/overview',
      icon: HomeOutlinedIcon,
    },
    {
      labelKey: 'navigation.qualifications',
      path: '/admin/qualifications',
      icon: CheckBoxIcon,
    },
    {
      labelKey: 'navigation.competencies',
      path: '/admin/competencies',
      icon: StarBorderIcon,
    },
    { labelKey: 'navigation.log', path: '/admin/log', icon: HistoryIcon },
  ],
}
