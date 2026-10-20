import { Chip } from '@mui/material'

import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { tones } from '../config/tones'

export default function CriticalBadge() {
  return (
    <Chip
      icon={<ShieldOutlinedIcon />}
      label="Critical"
      size="small"
      variant="outlined"
      sx={{
        height: 24,
        borderRadius: 1,
        borderColor: tones.criticalBadge.main,
        bgcolor: tones.criticalBadge.background,
        color: tones.criticalBadge.text,
        fontSize: 12,
        fontWeight: 600,
        '& .MuiChip-icon': { ml: 0.75, fontSize: 15, color: tones.criticalBadge.text },
        '& .MuiChip-label': { pl: 0.5, pr: 1 },
      }}
    />
  )
}