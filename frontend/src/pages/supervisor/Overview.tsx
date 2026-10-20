import { Box } from '@mui/material'
import { useNavigate } from 'react-router'

import GenericStatCard from '../../components/GenericStatCard'
import UpcomingExpirationsTable, {
  type ExpirationItem,
} from '../../components/UpcomingExpirationsTable'

// Temporary frontend data. Replace with backend data later.
const expirationItems: ExpirationItem[] = [
  {
    id: 1,
    employee: 'Emma Johnson',
    competency: 'Magnetic Flux Leakage (MFL)',
    expires: '17.10.2026',
    urgencyDays: 14,
    renewalPlan: null,
  },
  {
    id: 2,
    employee: 'Alex Smith',
    competency: 'First Aid Training',
    expires: '26.10.2026',
    urgencyDays: 23,
    renewalPlan: '20.10.2026',
  },
  {
    id: 3,
    employee: 'Mia Wilson',
    competency: 'Safety Card',
    expires: '06.11.2026',
    urgencyDays: 34,
    renewalPlan: null,
  },
  {
    id: 4,
    employee: 'Jessica Wilson',
    competency: 'Forklift Licence',
    expires: '23.11.2026',
    urgencyDays: 51,
    renewalPlan: '11.11.2026',
  },
  {
    id: 5,
    employee: 'Zara Lopez',
    competency: 'Guided Wave Testing (GWT)',
    expires: '28.11.2026',
    urgencyDays: 56,
    renewalPlan: null,
  },
  {
    id: 6,
    employee: 'Ashley Jones',
    competency: 'Leak Testing (LT)',
    expires: '02.12.2026',
    urgencyDays: 60,
    renewalPlan: null,
  },
  {
    id: 7,
    employee: 'Noah Carlsen',
    competency: 'Through Transmission Ultrasound',
    expires: '14.12.2026',
    urgencyDays: 72,
    renewalPlan: null,
  },
]

export default function SupervisorOverview() {
  const navigate = useNavigate()

  const openRenewals = () => {
    void navigate('/supervisor/renewals')
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
        items={expirationItems}
        onItemClick={() => {
          void navigate('/supervisor/renewals')
        }}
      />
    </Box>
  )
}