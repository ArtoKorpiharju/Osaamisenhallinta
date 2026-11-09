import { IconButton } from '@mui/material'

import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

import { tones } from '../config/tones'

interface FavoriteStarIconProps {
  /** Tooltip / accessible title for the icon when it is shown on its own */
  title?: string
}

/** The filled "favorite" star, also used in tables and in the legend */
export function FavoriteStarIcon({ title }: FavoriteStarIconProps) {
  return (
    <StarIcon
      fontSize="small"
      titleAccess={title}
      sx={{
        flexShrink: 0,
        color: tones.star.main,
        stroke: 'black',
        strokeWidth: 0.5,
      }}
    />
  )
}

interface FavoriteStarProps {
  active: boolean
  /** Accessible name, e.g. "Add First Aid Training to Overview" */
  label: string
  onToggle: () => void
}

export default function FavoriteStar({
  active,
  label,
  onToggle,
}: FavoriteStarProps) {
  return (
    <IconButton
      size="small"
      aria-label={label}
      aria-pressed={active}
      onClick={(event) => {
        // The star sits inside a clickable row: do not let the click expand it
        event.stopPropagation()
        onToggle()
      }}
      sx={{ p: 0.25 }}
    >
      {active ? (
        <FavoriteStarIcon />
      ) : (
        <StarBorderIcon fontSize="small" sx={{ color: '#9aa3ae' }} />
      )}
    </IconButton>
  )
}
