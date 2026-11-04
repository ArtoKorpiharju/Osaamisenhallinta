import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import StatCard from '../GenericStatCard'
import { type OverviewSummary } from '../../types/overview'

interface SummaryCardsProps {
  summary: OverviewSummary
  onViewDetails?: (key: keyof OverviewSummary) => void
}

export default function SummaryCards({
  summary,
  onViewDetails,
}: SummaryCardsProps) {
  const { t } = useTranslation()
  const actionFor = (key: keyof OverviewSummary) =>
    onViewDetails
      ? {
          actionLabel: t('employeeOverview.viewAllDetails'),
          onAction: () => {
            onViewDetails(key)
          },
        }
      : {}

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 1,
      }}
    >
      <StatCard
        title={t('employeeOverview.summary.invalid.title')}
        value={summary.outdated}
        description={t('employeeOverview.summary.invalid.description')}
        highlight={t('employeeOverview.summary.invalid.highlight')}
        tone="danger"
        {...actionFor('outdated')}
      />
      <StatCard
        title={t('employeeOverview.summary.expiringSoon.title')}
        value={summary.expiring}
        description={t('employeeOverview.summary.expiringSoon.description')}
        tone="warning"
        {...actionFor('expiring')}
      />
      <StatCard
        title={t('employeeOverview.summary.missingRenewals.title')}
        value={summary.missingRenewals}
        description={t('employeeOverview.summary.missingRenewals.description')}
        tone="renewal"
        {...actionFor('missingRenewals')}
      />
      <StatCard
        title={t('employeeOverview.summary.plannedRenewals.title')}
        value={summary.plannedRenewals}
        description={t('employeeOverview.summary.plannedRenewals.description')}
        tone="success"
        {...actionFor('plannedRenewals')}
      />
    </Box>
  )
}
