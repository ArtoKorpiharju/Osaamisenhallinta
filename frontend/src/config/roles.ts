import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import HistoryIcon from '@mui/icons-material/History'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export const roles = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
] as const

export type Role = (typeof roles)[number]['value']

interface Page {
  label: string // The label of the page displayed in the navigation menu.
  path: string // The path of the page used for routing.
  icon: ComponentType<SvgIconProps> // The icon of the page displayed in the navigation menu.
}

export const pagesPerRole: Record<Role, Page[]> = {
  employee: [
    { label: 'Overview', path: '/employee/overview', icon: HomeOutlinedIcon },
    {
      label: 'Qualifications',
      path: '/employee/qualifications',
      icon: CheckBoxIcon,
    },
    {
      label: 'Competencies',
      path: '/employee/competencies',
      icon: StarBorderIcon,
    },
    { label: 'Renewals', path: '/employee/renewals', icon: EventRepeatIcon },
  ],
  manager: [
    { label: 'Overview', path: '/manager/overview', icon: HomeOutlinedIcon },
    {
      label: 'Qualifications',
      path: '/manager/qualifications',
      icon: CheckBoxIcon,
    },
    {
      label: 'Competencies',
      path: '/manager/competencies',
      icon: StarBorderIcon,
    },
    { label: 'Renewals', path: '/manager/renewals', icon: EventRepeatIcon },
  ],
  admin: [
    { label: 'Overview', path: '/admin/overview', icon: HomeOutlinedIcon },
    {
      label: 'Qualifications',
      path: '/admin/qualifications',
      icon: CheckBoxIcon,
    },
    {
      label: 'Competencies',
      path: '/admin/competencies',
      icon: StarBorderIcon,
    },
    { label: 'Log', path: '/admin/log', icon: HistoryIcon },
  ],
}
