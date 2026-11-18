import type { ReactNode } from 'react'
import { Typography } from '@mui/material'
import { tones } from '../config/tones'

interface PageTitleProps {
  children: ReactNode
}

export default function PageTitle({ children }: PageTitleProps) {
  return (
    <Typography variant="h1" sx={{ mt: '25px', color: tones.info.main }}>
      {children}
    </Typography>
  )
}
