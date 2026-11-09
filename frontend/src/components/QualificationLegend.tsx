import { Box, Typography } from '@mui/material'

import CriticalBadge from './CriticalBadge'
import { FavoriteStarIcon } from './FavoriteStar'

interface QualificationLegendProps {
  /** Text next to the star, e.g. "My favorite" or "Add to Overview" */
  favoriteLabel?: string
}

export default function QualificationLegend({
  favoriteLabel = 'My favorite',
}: QualificationLegendProps) {
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
        <Typography sx={{ fontSize: 13 }}>= Employer requirement</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <FavoriteStarIcon />
        <Typography sx={{ fontSize: 13 }}>= {favoriteLabel}</Typography>
      </Box>
    </Box>
  )
}
