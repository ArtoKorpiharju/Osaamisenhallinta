import { Box } from '@mui/material'

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
  const actionFor = (key: keyof OverviewSummary) =>
    onViewDetails
      ? {
          actionLabel: 'View all details',
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
        title="Invalid"
        value={summary.outdated}
        description="Invalid competencies"
        highlight="Requires attention"
        tone="danger"
        {...actionFor('outdated')}
      />
      <StatCard
        title="Expiring soon"
        value={summary.expiring}
        description="Expiring within 90 days"
        tone="warning"
        {...actionFor('expiring')}
      />
      <StatCard
        title="Missing renewals"
        value={summary.missingRenewals}
        description="Missing renewals"
        tone="renewal"
        {...actionFor('missingRenewals')}
      />
      <StatCard
        title="Planned renewals"
        value={summary.plannedRenewals}
        description="Planned renewals"
        tone="success"
        {...actionFor('plannedRenewals')}
      />
    </Box>
  )
}
