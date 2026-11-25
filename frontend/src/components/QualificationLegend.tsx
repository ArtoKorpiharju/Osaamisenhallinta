import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import CriticalBadge from './CriticalBadge'
import { FavoriteStarIcon } from './FavoriteStar'

interface QualificationLegendProps {
  /** Text next to the star. Defaults to the "My favorite" translation. */
  favoriteLabel?: string
}

export default function QualificationLegend({
  favoriteLabel,
}: QualificationLegendProps) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 24px',
        color: '#174f83',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <CriticalBadge />
        <Typography sx={{ fontSize: 13 }}>
          = {t('employeeOverview.qualifications.employerRequirement')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <FavoriteStarIcon />
        <Typography sx={{ fontSize: 13 }}>
          = {favoriteLabel ?? t('employeeOverview.qualifications.favorite')}
        </Typography>
      </Box>
    </Box>
  )
}
