import { Alert, Box } from '@mui/material'
import { useNavigate, useOutletContext } from 'react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageTitle from '../../components/PageTitle'
import PageContainer from '../../components/PageContainer'

import GenericStatCard from '../../components/GenericStatCard'
import InvalidAndExpiringCompetenciesTable, {
  type ExpirationItem,
} from '../../components/SupervisorOverview/InvalidAndExpiringCompetenciesTable'
import {
  type ExpiringCompetency,
  type OverviewSummary,
} from '../../types/overview'
import { fetchExpiringCompetencies } from '../../services/supervisor/supervisorOverview'
import { getApiErrorMessage } from '../../services/api'
import { formatDate } from '../../utils/formatDate'

// Make sure the expiring qualifications are unique,
// not many instances from different qualifications
function uniqueEmployeeCompetencies(
  competencies: ExpiringCompetency[]
): ExpiringCompetency[] {
  const unique = new Map<string, ExpiringCompetency>()

  for (const competency of competencies) {
    const key = `${String(competency.employeeId)}-${String(competency.competencyId)}`
    if (!unique.has(key)) {
      unique.set(key, competency)
    }
  }

  return [...unique.values()]
}

// Get summary-card counts from the unit's expiring competencies
function calculateSummary(competencies: ExpiringCompetency[]): OverviewSummary {
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
        competency.renewalDate === null
      ) {
        counts.missingRenewals++
      }

      if (competency.renewalDate !== null) {
        counts.plannedRenewals++
      }
      return counts
    },
    { outdated: 0, expiring: 0, missingRenewals: 0, plannedRenewals: 0 }
  )
}

// Days from today to the given ISO date. Past dates return 0.
function daysUntil(isoDate: string): number {
  const now = new Date()
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())

  return Math.max(
    0,
    Math.round((new Date(isoDate).getTime() - today) / (24 * 60 * 60 * 1000))
  )
}

// Create table rows for expiring competencies
function createExpirationItems(
  competencies: ExpiringCompetency[]
): ExpirationItem[] {
  return competencies
    .flatMap((competency) => {
      const isInvalid = competency.status === 'expired'
      const isExpiringSoon = competency.status === 'expiringSoon'

      // Only these statuses need attention, and the row needs an expiration date.
      if (
        (!isInvalid && !isExpiringSoon) ||
        competency.expirationDate === null
      ) {
        return []
      }

      return [{ ...competency, expirationDate: competency.expirationDate }]
    })
    .sort(
      (a, b) =>
        a.expirationDate.localeCompare(b.expirationDate) ||
        a.employeeLastName.localeCompare(b.employeeLastName) ||
        a.employeeFirstName.localeCompare(b.employeeFirstName)
    )
    .map((competency, index) => ({
      id: index,
      employee: `${competency.employeeFirstName} ${competency.employeeLastName}`,
      competency: competency.competencyName,
      expires: formatDate(competency.expirationDate),
      urgencyDays: daysUntil(competency.expirationDate),
      renewalPlan:
        competency.renewalDate === null
          ? null
          : formatDate(competency.renewalDate),
    }))
}

export default function SupervisorOverview() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { unitId } = useOutletContext<{ unitId: number | undefined }>()

  const [expiringCompetencies, setExpiringCompetencies] = useState<
    ExpiringCompetency[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const competencies = uniqueEmployeeCompetencies(expiringCompetencies)
  const summary = calculateSummary(competencies)
  const expirationItems = createExpirationItems(competencies)

  // Fetch the expiring competencies data
  useEffect(() => {
    if (unitId === undefined) return
    fetchExpiringCompetencies(unitId)
      .then(setExpiringCompetencies)
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(err, 'Could not load supervisor overview data', {
            400: 'Bad request for supervisor overview data',
            404: 'Supervised unit could not be found',
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [unitId])

  const openMyUnit = () => {
    void navigate('/supervisor/my-unit')
  }

  // Page container
  return (
    <PageContainer>
      <PageTitle>{t('supervisorOverview.title')}</PageTitle>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && unitId !== undefined && (
        <Alert severity="info">Fetching supervisor overview data…</Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        <GenericStatCard
          title={t('supervisorOverview.summary.invalid.title')}
          value={summary.outdated}
          description={t('supervisorOverview.summary.invalid.description')}
          highlight={
            summary.outdated > 0
              ? t('supervisorOverview.summary.invalid.highlight')
              : undefined
          }
          tone="danger"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openMyUnit}
        />

        <GenericStatCard
          title={t('supervisorOverview.summary.expiringSoon.title')}
          value={summary.expiring}
          description={t('supervisorOverview.summary.expiringSoon.description')}
          tone="warning"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openMyUnit}
        />

        <GenericStatCard
          title={t('supervisorOverview.summary.requireAction.title')}
          value={summary.missingRenewals}
          description={t(
            'supervisorOverview.summary.requireAction.description'
          )}
          tone="renewal"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openMyUnit}
        />

        <GenericStatCard
          title={t('supervisorOverview.summary.plannedRenewals.title')}
          value={summary.plannedRenewals}
          description={t(
            'supervisorOverview.summary.plannedRenewals.description'
          )}
          tone="success"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openMyUnit}
        />
      </Box>

      <InvalidAndExpiringCompetenciesTable
        items={expirationItems}
        onItemClick={openMyUnit}
      />
    </PageContainer>
  )
}
