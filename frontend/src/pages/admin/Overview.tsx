import Card from '../../components/Card'
import QuickActions from '../../components/QuickActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SvgIconComponent } from '@mui/icons-material'
import PageTitle from '../../components/PageTitle'
import { useTranslation } from 'react-i18next'
import PageContainer from '../../components/PageContainer'


import AttachFileIcon from '@mui/icons-material/AttachFile'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import Diversity1Icon from '@mui/icons-material/Diversity1'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied'

export default function AdminOverview() {
  const { t } = useTranslation()

  const cards = new Map<string, SvgIconComponent>([
    [t('adminOverview.cards.certificates'), AttachFileIcon],
    [t('adminOverview.cards.skills'), DirectionsWalkIcon],
    [t('adminOverview.cards.trainings'), Diversity1Icon],
    [t('adminOverview.cards.licenses'), FolderOpenIcon],
    [t('adminOverview.cards.qualifications'), SensorOccupiedIcon],
  ])
  const cardComponents = Array.from(cards).map(([item, Icon]) => (
    <Card key={item} item={item} icon={Icon} />
  ))

  return (
  <PageContainer gap={2}>
    <Box>
      <PageTitle>{t('adminOverview.title')}</PageTitle>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 13,
          color: 'text.secondary',
        }}
      >
        {t('adminOverview.description')}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '25px',
        }}
      >
        {cardComponents}
      </Box>

      <Box>
        <QuickActions />
      </Box>
    </Box>
  </PageContainer>
)
}
