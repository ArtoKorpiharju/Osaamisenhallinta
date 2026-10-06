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
        title="Outdated"
        value={summary.outdated}
        description="Expired competencies"
        highlight="Requires attention"
        tone="danger"
        {...actionFor('outdated')}
      />
      <StatCard
        title="Expiring"
        value={summary.expiring}
        description="Expiring within 90 days"
        tone="warning"
        {...actionFor('expiring')}
      />
      <StatCard
        title="Renewals"
        value={summary.renewals}
        description="Missing Renewals"
        tone="renewal"
        {...actionFor('renewals')}
      />
      <StatCard
        title="Planned"
        value={summary.planned}
        description="Planned Renewals"
        tone="success"
        {...actionFor('planned')}
      />
    </Box>
  )
}
