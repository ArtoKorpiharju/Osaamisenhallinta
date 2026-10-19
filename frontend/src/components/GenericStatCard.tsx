import { Box, Link, Paper, Typography } from '@mui/material'

import { type Tone, tones } from '../config/tones'

interface StatCardProps {
  title: string
  value: number | string
  description: string
  tone: Tone
  // Text under the description e.g Requires attention.
  highlight?: string
  actionLabel?: string
  onAction?: () => void
}

export default function StatCard({
  title,
  value,
  description,
  tone,
  highlight,
  actionLabel,
  onAction,
}: StatCardProps) {
  const color = tones[tone].main

  return (
    <Paper
      component="article"
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0,
        px: 2.25,
        pt: 2,
        pb: 1.5,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Typography component="h3" sx={{ fontSize: 16, fontWeight: 700 }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
        <Typography
          component="span"
          sx={{ fontSize: 44, fontWeight: 700, lineHeight: 1, color }}
        >
          {value}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {description}
          </Typography>
          {highlight !== undefined && (
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: tones.danger.main }}
            >
              {highlight}
            </Typography>
          )}
        </Box>
      </Box>

      {actionLabel !== undefined && onAction !== undefined && (
        <Link
          component="button"
          type="button"
          underline="always"
          onClick={() => {
            onAction()
          }}
          sx={{ alignSelf: 'flex-end', fontSize: 11, color: '#174f83' }}
        >
          {actionLabel}
        </Link>
      )}
    </Paper>
  )
}
