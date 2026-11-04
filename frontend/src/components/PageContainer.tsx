import type { ReactNode } from 'react'
import { Box } from '@mui/material'

interface PageContainerProps {
  children: ReactNode
  gap?: number
}

export default function PageContainer({
  children,
  gap = 4,
}: PageContainerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        width: '100%',
        p: 3,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  )
}
