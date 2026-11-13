import { type ReactNode } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CloseIcon from '@mui/icons-material/Close'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import StarBorderIcon from '@mui/icons-material/StarBorder'

import StatusChip from '../StatusChip'
import {
  competenceTypeLabels,
  competencyStatusDisplay,
} from '../../config/qualifications'
import { tones } from '../../config/tones'
import { type EmployeeCompetency } from '../../types/overview'
import { formatDate } from '../../utils/formatDate'

interface CompetenceDetailDialogProps {
  competence: EmployeeCompetency | null
  // Name of the qualification the competence was opened from (breadcrumb).
  qualificationName?: string
  onClose: () => void
  onPlanRenewal?: (competence: EmployeeCompetency) => void
  onViewRenewalPlan?: (competence: EmployeeCompetency) => void
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Typography sx={{ width: 110, fontSize: 13 }}>{label}</Typography>
      <Box sx={{ fontSize: 13, fontWeight: 600 }}>{children}</Box>
    </Box>
  )
}

const dateOrDash = (isoDate: string | null) =>
  isoDate ? formatDate(isoDate) : '-'

export default function CompetenceDetailDialog({
  competence,
  qualificationName = 'Qualifications',
  onClose,
  onPlanRenewal,
  onViewRenewalPlan,
}: CompetenceDetailDialogProps) {
  const status = competence ? competencyStatusDisplay[competence.status] : null

  return (
    <Dialog
      open={competence !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      {competence && status && (
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <IconButton aria-label="Back" size="small" onClick={onClose}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ fontSize: 13 }}>{qualificationName}</Typography>
            <Typography sx={{ fontSize: 13 }}>{'>'}</Typography>
            <Typography sx={{ fontSize: 13, flex: 1 }}>
              {competence.name}
            </Typography>
            <IconButton aria-label="Close" size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, px: 1 }}>
            <StarBorderIcon sx={{ color: 'text.disabled', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography component="h2" sx={{ fontSize: 24, fontWeight: 700 }}>
                {competence.name}
              </Typography>
              <Typography sx={{ fontSize: 13, mt: 1 }}>
                {competenceTypeLabels[competence.type]}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 2,
              }}
            >
              <StatusChip label={status.label} tone={status.tone} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 12 }}>Valid until</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {dateOrDash(competence.expirationDate)}
                  </Typography>
                </Box>
                <CalendarMonthIcon />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'white',
              border: `1px solid ${tones.info.background}`,
              borderRadius: 1,
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                <Typography
                  component="h3"
                  sx={{ fontSize: 15, fontWeight: 700, mb: 1 }}
                >
                  Competence details
                </Typography>
                <DetailRow label="Type">
                  {competenceTypeLabels[competence.type]}
                </DetailRow>
                <DetailRow label="Status">
                  <StatusChip label={status.label} tone={status.tone} />
                </DetailRow>
                <DetailRow label="Issue date">
                  {dateOrDash(competence.issueDate)}
                </DetailRow>
                <DetailRow label="Valid until">
                  {dateOrDash(competence.expirationDate)}
                </DetailRow>
              </Box>
              <Box
                sx={{
                  width: 160,
                  height: 90,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(tones.info.main, 0.1),
                  color: tones.info.main,
                  borderRadius: 1,
                }}
              >
                <EngineeringOutlinedIcon sx={{ fontSize: 56 }} />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                mt: 6,
                mb: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={() => onPlanRenewal?.(competence)}
                sx={{
                  textTransform: 'none',
                  bgcolor: tones.info.main,
                  px: 4,
                  fontWeight: 700,
                }}
              >
                Plan renewal
              </Button>
              <Button
                variant="contained"
                startIcon={<EventAvailableIcon />}
                disabled={competence.renewalPlan === null}
                onClick={() => onViewRenewalPlan?.(competence)}
                sx={{
                  textTransform: 'none',
                  bgcolor: tones.info.main,
                  px: 4,
                  fontWeight: 700,
                }}
              >
                View renewal plan
              </Button>
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  )
}
