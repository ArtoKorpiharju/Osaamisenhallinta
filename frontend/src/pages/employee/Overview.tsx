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
  type EmployeeCompetency,
} from '../../types/overview'
import { tones } from '../../config/tones'
import { fetchEmployeeOverview } from '../../services/employee/employeeOverview'
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
  missingRenewals: paths.renewals,
  plannedRenewals: paths.renewals,
}

// Get summary-card counts from the employee's competencies.
// Missing renewals count only expired or expiring competencies without a plan.
// Planned renewals count any competency that has a plan.
function calculateSummary(competencies: EmployeeCompetency[]): OverviewSummary {
  return competencies.reduce(
    (counts, competency) => {
      if (competency.status === 'expired' || competency.status === 'missing') {
        counts.outdated++
      }

      if (competency.status === 'expiringSoon') {
        counts.expiring++
      }

      if (
        (competency.status === 'expired' ||
          competency.status === 'expiringSoon') &&
        competency.renewalPlan === null
      ) {
        counts.missingRenewals++
      }

      if (competency.renewalPlan !== null) {
        counts.plannedRenewals++
      }
      return counts
    },
    { outdated: 0, expiring: 0, missingRenewals: 0, plannedRenewals: 0 }
  )
}

// Create action cards for expired or expiring soon competencies.
// Show renewal details when a plan exists; otherwise offer renewal actions.
function createActionItems(
  competencies: EmployeeCompetency[]
): ActionRequiredItem[] {
  return competencies.flatMap((competency) => {
    const isInvalid = competency.status === 'expired'
    const isExpiringSoon = competency.status === 'expiringSoon'

    // Only these statuses need attention, and the card needs an expiration date.
    if ((!isInvalid && !isExpiringSoon) || competency.expirationDate === null) {
      return []
    }

    const plan = competency.renewalPlan

    const item: ActionRequiredItem = {
      id: String(competency.employeeCompetencyId),
      title: competency.name,
      dueDate: competency.expirationDate,
      status: isInvalid
        ? { label: 'Invalid', tone: 'danger' }
        : { label: 'Expiring soon', tone: 'warning' },
      actions: plan
        ? [{ id: 'view-renewal-plan', label: 'View renewal plan' }]
        : [
            { id: 'plan-renewal', label: 'Plan renewal' },
            { id: 'upload-certificate', label: 'Upload renewal certificate' },
          ],
      note: plan
        ? {
            text:
              plan.renewalComment ?? `Renewal planned for ${plan.renewalDate}`,
            tone: 'info',
          }
        : { text: 'No renewal planned', tone: 'danger' },
    }

    return [item]
  })
}

export default function EmployeeOverview() {
  const navigate = useNavigate()

  const { userId } = useOutletContext<{ userId: number | undefined }>()

  const [employeeOverview, setEmployeeOverview] = useState<EmployeeOverview>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const qualifications = employeeOverview?.qualifications ?? []
  const competencies = qualifications.flatMap(
    (qualification) => qualification.requiredCompetencies
  )

  const summary = calculateSummary(competencies)
  const actionItems = createActionItems(competencies)

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
            void navigate(
              `${paths.qualifications}/${String(qualification.employeeQualificationId)}`
            )
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
