import { Box, Link, Paper, Typography } from '@mui/material'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ErrorIcon from '@mui/icons-material/Error'

import StatusChip from './StatusChip'
import { type Tone, tones } from '../config/tones'
import { formatDate } from '../utils/formatDate'

interface ActionCardProps {
  title: string
  date?: string
  status?: { label: string; tone: Tone }
  actions?: { id: string; label: string }[]
  note?: { text: string }
  onAction?: (actionId: string) => void
}

export default function ActionCard({
  title,
  date,
  status,
  actions = [],
  note,
  onAction,
}: ActionCardProps) {
  const accent = tones[status?.tone ?? 'info'].main

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        px: 1.75,
        py: 1.5,
        borderColor: tones.info.background,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Typography
          component="h3"
          sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}
        >
          {title}
        </Typography>
        {status && <StatusChip label={status.label} tone={status.tone} />}
      </Box>

      {date !== undefined && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 11 }} />
          <Typography sx={{ fontSize: 10 }}>{formatDate(date)}</Typography>
        </Box>
      )}

      {actions.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', mt: 0.5 }}>
          {actions.map((action) => (
            <Link
              key={action.id}
              component="button"
              type="button"
              underline="always"
              onClick={() => {
                onAction?.(action.id)
              }}
              sx={{ fontSize: 11, color: '#174f83' }}
            >
              {action.label}
            </Link>
          ))}
        </Box>
      )}

      {note && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            mt: 0.5,
            px: 1,
            py: 0.75,
            borderRadius: 0.75,
            border: `1px solid ${tones.info.background}`,
            bgcolor: 'background.paper',
            color: 'text.secondary',
          }}
        >
          <ErrorIcon sx={{ fontSize: 14, color: tones.danger.main }} />
          <Typography sx={{ fontSize: 11, fontStyle: 'italic' }}>
            {note.text}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
