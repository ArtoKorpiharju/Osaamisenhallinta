import { Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import StatusChip from './StatusChip'
import { tones } from '../config/tones'
import { type RenewalPlan } from '../types/overview'
import { formatDate } from '../utils/formatDate'

interface RenewalChipProps {
  // null if no renewal is planned.
  plan: RenewalPlan | null
}

export default function RenewalChip({ plan }: RenewalChipProps) {
  const { t } = useTranslation()

  if (plan === null) {
    return (
      <StatusChip label={t('qualifications.renewal.notPlanned')} tone="info" />
    )
  }

  return (
    <Chip
      label={t('qualifications.renewal.planned', {
        date: formatDate(plan.renewalDate),
      })}
      size="small"
      sx={{
        height: 20,
        borderRadius: 0.75,
        typography: 'caption',
        bgcolor: alpha(tones.info.main, 0.15),
        color: tones.info.main,
        '& .MuiChip-label': { px: 0.75 },
      }}
    />
  )
}
