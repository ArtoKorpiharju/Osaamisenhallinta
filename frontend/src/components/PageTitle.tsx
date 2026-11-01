import type { ReactNode } from 'react'
import { Typography } from '@mui/material'

import { textStyles } from '../config/typography'

interface PageTitleProps {
  children: ReactNode
}

export default function PageTitle({ children }: PageTitleProps) {
  return (
    <Typography component="h1" sx={textStyles.pageTitle}>
      {children}
    </Typography>
  )
}