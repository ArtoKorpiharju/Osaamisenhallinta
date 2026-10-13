import { Box } from '@mui/material'
import { useNavigate } from 'react-router'

import GenericStatCard from '../../components/GenericStatCard'
import UpcomingExpirationsTable from '../../components/UpcomingExpirationsTable'

export default function SupervisorOverview() {
  const navigate = useNavigate()

  const openRenewals = () => {
    navigate('/supervisor/renewals')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
      }}
    >
      <h1>Supervisor Overview</h1>

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
          title="Outdated"
          value={2}
          description="Expired competencies"
          highlight="Requires attention"
          tone="danger"
          actionLabel="View all details"
          onAction={openRenewals}
        />

        <GenericStatCard
          title="Expiring"
          value={6}
          description="Expiring within 90 days"
          tone="warning"
          actionLabel="View all details"
          onAction={openRenewals}
        />

        <GenericStatCard
          title="Renewals"
          value={4}
          description="Missing renewals"
          tone="renewal"
          actionLabel="View all details"
          onAction={openRenewals}
        />

        <GenericStatCard
          title="Planned"
          value={3}
          description="Planned renewals"
          tone="success"
          actionLabel="View all details"
          onAction={openRenewals}
        />
      </Box>

      <UpcomingExpirationsTable
        onItemClick={() => {
          navigate('/supervisor/renewals')
        }}
      />
    </Box>
  )
}