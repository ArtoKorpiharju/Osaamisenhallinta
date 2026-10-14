import type { ReactNode } from 'react'

import { Box, Paper, Typography } from '@mui/material'

interface PanelProps {
  title: string
  // Element e.g View all button.
  headerAction?: ReactNode
  children: ReactNode
}

export default function Panel({ title, headerAction, children }: PanelProps) {
  return (
    <Paper
      component="section"
      aria-label={title}
      variant="outlined"
      square
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
        borderColor: '#e0e3e8',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexShrink: 0,
          minHeight:35,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          px: 2,
          py: 1.25,
          bgcolor: '#e4edf5',
          borderBottom: '1px solid #e0e3e8',
        }}
      >
        <Typography
          component="h2"
          sx={{ fontSize: 18, fontWeight: 700, color: '#6b7685' }}
        >
          {title}
        </Typography>
        {headerAction}
      </Box>
      {}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2 }}>
        {children}
      </Box>
    </Paper>
  )
}
