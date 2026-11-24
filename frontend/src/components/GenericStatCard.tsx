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
      <Typography variant="h3">{title}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
        <Typography
          component="span"
          sx={{ fontSize: 44, fontWeight: 700, lineHeight: 1, color }}
        >
          {value}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
          {highlight !== undefined && (
            <Typography variant="subtitle2" sx={{ color: tones.danger.main }}>
              {highlight}
            </Typography>
          )}
        </Box>
      </Box>

      {actionLabel !== undefined && onAction !== undefined && (
        <Link
          component="button"
          type="button"
          variant="caption"
          underline="always"
          onClick={() => {
            onAction()
          }}
          sx={{ alignSelf: 'flex-end', color: '#174f83' }}
        >
          {actionLabel}
        </Link>
      )}
    </Paper>
  )
}
