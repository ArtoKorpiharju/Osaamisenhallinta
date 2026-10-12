import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router'

import ActionRequired from '../../components/EmployeeOverview/ActionRequired'
import MyQualifications from '../../components/EmployeeOverview/MyQualifications'
import SummaryCards from '../../components/EmployeeOverview/SummaryCards'
import {
  type ActionRequiredItem,
  type OverviewSummary,
  type Qualification,
} from '../../types/overview'
import { type Tone, tones } from '../../config/tones'


const paths = {
  qualifications: '/employee/Qualifications',
  renewals: '/employee/Renewals',
  competencies: '/employee/Competencies',
}

// Replace with API calls
const detailPaths: Record<keyof OverviewSummary, string> = {
  outdated: paths.competencies,
  expiring: paths.competencies,
  renewals: paths.renewals,
  planned: paths.renewals,
}

// Replace with API calls
const summary: OverviewSummary = {
  outdated: 2,
  expiring: 6,
  renewals: 4,
  planned: 3,
}

// Replace with API calls
const qualifications: Qualification[] = [
  { id: '1', name: 'Magnetic Flux Leakage (MFL)', status: 'expired', requirementsMet: 0, requirementsTotal: 2, validUntil: '2026-03-16' },
  { id: '2', name: 'First Aid Training', status: 'expired', requirementsMet: 3, requirementsTotal: 4, validUntil: '2026-03-26', isPrimary: true },
  { id: '3', name: 'Safety Card', status: 'expiring', requirementsMet: 3, requirementsTotal: 3, validUntil: '2026-06-06' },
  { id: '4', name: 'Forklift Licence', status: 'expiring', requirementsMet: 2, requirementsTotal: 2, validUntil: '2026-06-23' },
  { id: '5', name: 'Guided wave Testing (GWT)', status: 'qualified', requirementsMet: 3, requirementsTotal: 3, validUntil: '2026-06-28' },
  { id: '6', name: 'Leak Testing (LT)', status: 'qualified', requirementsMet: 3, requirementsTotal: 3, validUntil: '2026-07-02' },
  { id: '7', name: 'Through Transmission Ultrasound', status: 'qualified', requirementsMet: 3, requirementsTotal: 3, validUntil: '2026-07-14' },
  { id: '8', name: 'Fire Safety', status: 'expiring', requirementsMet: 3, requirementsTotal: 3, validUntil: '2026-07-19' },
]

// Replace with API calls
const actionItems: ActionRequiredItem[] = [
  {
    id: 'a1',
    title: 'Occupational Safety Card OSC',
    dueDate: '2026-06-15',
    status: { label: 'Expired', tone: 'danger' },
    actions: [
      { id: 'plan-renewal', label: 'Plan renewal' },
      { id: 'upload-certificate', label: 'Upload renewal certificate' },
    ],
    note: { text: 'No renewal planned', tone: 'danger' },
  },
  {
    id: 'a2',
    title: 'FRC First Aid EA 1',
    dueDate: '2026-10-21',
    status: { label: 'Expiring soon', tone: 'warning' },
    actions: [
      { id: 'plan-renewal', label: 'Plan renewal' },
      { id: 'upload-certificate', label: 'Upload renewal certificate' },
    ],
    note: { text: 'No renewal planned', tone: 'danger' },
  },
  {
    id: 'a3',
    title: 'Forklift Operator Certificate',
    dueDate: '2026-10-21',
    status: { label: 'Expiring soon', tone: 'warning' },
    actions: [
      { id: 'plan-renewal', label: 'Plan renewal' },
      { id: 'upload-certificate', label: 'Upload renewal certificate' },
    ],
    note: { text: 'No renewal planned', tone: 'info' },
  },
  {
    id: 'a4',
    title: 'Fire Safety Training',
    dueDate: '2026-10-15',
    status: { label: 'Expired', tone: 'danger' },
    actions: [
      { id: 'plan-renewal', label: 'Plan renewal' },
      { id: 'upload-certificate', label: 'Upload renewal certificate' },
    ],
    note: { text: 'No renewal planned', tone: 'info' },
  },
]

export default function EmployeeOverview() {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 3 }}>
      <Typography
        component="h1"
        sx={{ fontSize: 18, fontWeight: 700, color: tones.info.main }}
      >
        Employee Overview
      </Typography>

      <SummaryCards
        summary={summary}
        onViewDetails={(key) => {
          void navigate(detailPaths[key])
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2fr) minmax(0, 1fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <MyQualifications
          qualifications={qualifications}
          onViewAll={() => {
            void navigate(paths.qualifications)
          }}
          onQualificationClick={(qualification) => {
            void navigate(`${paths.qualifications}/${qualification.id}`)
          }}
        />
        <ActionRequired
          items={actionItems}
          onAction={() => {
            void navigate(paths.renewals)
          }}
        />
      </Box>
    </Box>
  )
}
