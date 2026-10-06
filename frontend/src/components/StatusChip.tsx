import { Chip } from '@mui/material'

import { type Tone, tones } from '../config/tones'

interface StatusChipProps {
  label: string
  tone: Tone
}

export default function StatusChip({ label, tone }: StatusChipProps) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 20,
        borderRadius: 0.75,
        fontSize: 11,
        bgcolor: tones[tone].background,
        color: tones[tone].text,
        '& .MuiChip-label': { px: 0.75 },
      }}
    />
  )
}
