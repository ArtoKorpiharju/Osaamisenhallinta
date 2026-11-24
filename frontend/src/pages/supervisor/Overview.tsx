import { Box } from '@mui/material'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import PageTitle from '../../components/PageTitle'
import PageContainer from '../../components/PageContainer'

import GenericStatCard from '../../components/GenericStatCard'
import InvalidAndExpiringCompetenciesTable, {
  type ExpirationItem,
} from '../../components/InvalidAndExpiringCompetenciesTable'

// Temporary frontend data. Replace with backend data later.
const expirationItems: ExpirationItem[] = [
  {
    id: 1,
    employee: 'Emma Johnson',
    competency: 'Magnetic Flux Leakage (MFL)',
    expires: null,
    urgencyDays: 0,
    renewalPlan: null,
  },
  {
    id: 2,
    employee: 'Alex Smith',
    competency: 'First Aid Training',
    expires: '26.10.2026',
    urgencyDays: 0,
    renewalPlan: '20.12.2026',
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
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Rename and modify this to navigate to the correct page
  const openPageX = () => {
    void navigate('/supervisor/overview')
  }

  return (
    <PageContainer>
      <PageTitle>{t('supervisorOverview.title')}</PageTitle>

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
          value={2}
          description={t('supervisorOverview.summary.invalid.description')}
          highlight={t('supervisorOverview.summary.invalid.highlight')}
          tone="danger"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openPageX}
        />

        <GenericStatCard
          title={t('supervisorOverview.summary.expiringSoon.title')}
          value={5}
          description={t('supervisorOverview.summary.expiringSoon.description')}
          tone="warning"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openPageX}
        />

        <GenericStatCard
          title={t('supervisorOverview.summary.requireAction.title')}
          value={5}
          description={t(
            'supervisorOverview.summary.requireAction.description'
          )}
          tone="renewal"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openPageX}
        />

        <GenericStatCard
          title={t('supervisorOverview.summary.plannedRenewals.title')}
          value={2}
          description={t(
            'supervisorOverview.summary.plannedRenewals.description'
          )}
          tone="success"
          actionLabel={t('supervisorOverview.viewAllDetails')}
          onAction={openPageX}
        />
      </Box>

      <InvalidAndExpiringCompetenciesTable
        items={expirationItems}
        onItemClick={openPageX}
      />
    </PageContainer>
  )
}
