import { Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'

import StatusChip from './StatusChip'
import { tones } from '../config/tones'
import { type RenewalPlan } from '../types/overview'
import { formatDate } from '../utils/formatDate'

interface RenewalChipProps {
  // null if no renewal is planned.
  plan: RenewalPlan | null
}

export default function RenewalChip({ plan }: RenewalChipProps) {
  if (plan === null) {
    return <StatusChip label="Not planned" tone="info" />
  }

  return (
    <Chip
      label={`Planned - ${formatDate(plan.renewalDate)}`}
      size="small"
      sx={{
        height: 20,
        borderRadius: 0.75,
        fontSize: 11,
        bgcolor: alpha(tones.info.main, 0.15),
        color: tones.info.main,
        '& .MuiChip-label': { px: 0.75 },
      }}
    />
  )
}
