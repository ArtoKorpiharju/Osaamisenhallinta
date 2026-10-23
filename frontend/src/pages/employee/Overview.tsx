import { Alert, Box, Typography } from '@mui/material'
import { useNavigate, useOutletContext } from 'react-router'
import { useEffect, useState } from 'react'

import ActionRequired from '../../components/EmployeeOverview/ActionRequired'
import MyQualifications from '../../components/EmployeeOverview/MyQualifications'
import SummaryCards from '../../components/EmployeeOverview/SummaryCards'
import {
  type EmployeeOverview,
  type ActionRequiredItem,
  type OverviewSummary,
} from '../../types/overview'
import { tones } from '../../config/tones'
import { fetchEmployeeOverview } from '../../services/employee'
import { getApiErrorMessage } from '../../services/api'

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

  const { userId } = useOutletContext<{ userId: number | undefined }>()

  const [employeeOverview, setEmployeeOverview] = useState<EmployeeOverview>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId === undefined) return

    fetchEmployeeOverview(userId)
      .then(setEmployeeOverview)
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(err, 'Could not load employee overview data', {
            404: 'Employee overview data could not be found',
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 3 }}>
      <Typography
        component="h1"
        sx={{ fontSize: 18, fontWeight: 700, color: tones.info.main }}
      >
        Employee Overview
      </Typography>

      {/** Display an error alert if there was an error fetching employee overview. */}
      {error && <Alert severity="error">{error}</Alert>}

      {/** Display an info alert while employee overview is being fetched. */}
      {loading && userId !== undefined && (
        <Alert severity="info">Fetching employee overview data…</Alert>
      )}

      <SummaryCards
        summary={summary}
        onViewDetails={(key) => {
          void navigate(detailPaths[key])
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 2fr) minmax(0, 1fr)',
          },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <MyQualifications
          qualifications={employeeOverview?.qualifications ?? []}
          onViewAll={() => {
            void navigate(paths.qualifications)
          }}
          onQualificationClick={(qualification) => {
            void navigate(`${paths.qualifications}/${String(qualification.id)}`)
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
