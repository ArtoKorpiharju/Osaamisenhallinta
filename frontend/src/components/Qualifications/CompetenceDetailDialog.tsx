import { useState, type ReactNode } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CloseIcon from '@mui/icons-material/Close'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import StatusChip from '../StatusChip'
import {
  competenceTypeKeys,
  competencyStatusDisplay,
} from '../../config/qualifications'
import { tones } from '../../config/tones'
import { type EmployeeCompetency } from '../../types/overview'
import { formatDate } from '../../utils/formatDate'

export interface RenewalPlanInput {
  // ISO date (YYYY-MM-DD)
  renewalDate: string
  renewalComment: string | null
}

interface CompetenceDetailDialogProps {
  competence: EmployeeCompetency | null
  // Name of the qualification the competence was opened from (breadcrumb).
  qualificationName?: string
  onClose: () => void
  // plan is null when the planned date was cleared, i.e. the plan is deleted.
  onSaveRenewalPlan?: (
    competence: EmployeeCompetency,
    plan: RenewalPlanInput | null
  ) => void
  onConfirmRenewal?: (
    competence: EmployeeCompetency,
    newIssueDate: string
  ) => void
}

const dateOrDash = (isoDate: string | null) =>
  isoDate ? formatDate(isoDate) : '-'

const cardSx = {
  bgcolor: 'white',
  border: `1px solid ${tones.info.background}`,
  borderRadius: 1,
  p: 2.5,
  boxSizing: 'border-box',
} as const

const primaryButtonSx = {
  bgcolor: tones.info.main,
  px: 3,
  '&.Mui-disabled': {
    bgcolor: tones.info.background,
    color: 'text.disabled',
  },
} as const

function DetailRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Typography variant="body2" sx={{ width: 90, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{ typography: 'subtitle2' }}>{children}</Box>
    </Box>
  )
}

interface DateFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  disabled?: boolean
}

// Native date input with a calendar icon in front of it.
function DateField({ value, onChange, label, disabled }: DateFieldProps) {
  return (
    <TextField
      type="date"
      size="small"
      fullWidth
      disabled={disabled}
      value={value}
      onChange={(event) => {
        onChange(event.target.value)
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <CalendarMonthIcon
                fontSize="small"
                sx={{ color: value ? tones.info.main : 'text.secondary' }}
              />
            </InputAdornment>
          ),
        },
        htmlInput: { 'aria-label': label },
      }}
      sx={{
        '& input': {
          typography: 'body2',
          fontWeight: value ? 700 : 400,
          color: value ? tones.info.main : 'text.secondary',
        },
      }}
    />
  )
}

interface ContentProps {
  competence: EmployeeCompetency
  qualificationName?: string
  onClose: () => void
  onSaveRenewalPlan?: CompetenceDetailDialogProps['onSaveRenewalPlan']
  onConfirmRenewal?: CompetenceDetailDialogProps['onConfirmRenewal']
}

// The form state lives here, so it is reset every time a competence is opened.
function CompetenceDetailContent({
  competence,
  qualificationName,
  onClose,
  onSaveRenewalPlan,
  onConfirmRenewal,
}: ContentProps) {
  const { t } = useTranslation()

  const status = competencyStatusDisplay[competence.status]
  const statusLabel = t(status.labelKey)
  const typeLabel = t(competenceTypeKeys[competence.type])

  const savedDate = competence.renewalPlan?.renewalDate ?? ''
  const savedComment = competence.renewalPlan?.renewalComment ?? ''

  const [plannedDate, setPlannedDate] = useState(savedDate)
  const [comment, setComment] = useState(savedComment)
  const [newIssueDate, setNewIssueDate] = useState('')

  const hasUnsavedChanges =
    plannedDate !== savedDate || comment !== savedComment
  // A competence the employee does not have yet has no id to attach a plan to.
  const planEditable = competence.employeeCompetencyId !== null
  // Clearing the date of a saved plan deletes the plan.
  const canSavePlan =
    planEditable &&
    hasUnsavedChanges &&
    (plannedDate !== '' || savedDate !== '')
  const canConfirmRenewal = newIssueDate !== ''

  return (
    <DialogContent sx={{ p: 3, bgcolor: '#f5f5f5' }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <IconButton
          aria-label={t('qualifications.detail.back')}
          size="small"
          onClick={onClose}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">
          {qualificationName ?? t('qualifications.title')}
        </Typography>
        <Typography variant="body2">{'>'}</Typography>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {competence.name}
        </Typography>
        <IconButton
          aria-label={t('qualifications.detail.close')}
          size="small"
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Title */}
      <Box sx={{ px: 1, mb: 3 }}>
        <Typography variant="h1" sx={{ fontSize: '1.75rem' }}>
          {competence.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
          {typeLabel}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {/* Competence details + renew competency */}
        <Box
          sx={{
            ...cardSx,
            flex: '1 1 480px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3">
                {t('qualifications.detail.title')}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                <DetailRow label={t('qualifications.detail.type')}>
                  {typeLabel}
                </DetailRow>
                <DetailRow label={t('qualifications.detail.status')}>
                  <StatusChip label={statusLabel} tone={status.tone} />
                </DetailRow>
                <DetailRow label={t('qualifications.detail.issueDate')}>
                  {dateOrDash(competence.issueDate)}
                </DetailRow>
                <DetailRow label={t('qualifications.detail.validUntil')}>
                  {dateOrDash(competence.expirationDate)}
                </DetailRow>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              mt: 'auto',
              pt: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Typography variant="subtitle2">
              {t('qualifications.detail.renewCompetency')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography
                variant="body2"
                sx={{ minWidth: 140, flexShrink: 0, fontWeight: 600 }}
              >
                {t('qualifications.detail.newIssueDate')}
              </Typography>
              <Box sx={{ flex: 1, maxWidth: 260 }}>
                <DateField
                  value={newIssueDate}
                  onChange={setNewIssueDate}
                  label={t('qualifications.detail.newIssueDate')}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                disabled={!canConfirmRenewal}
                onClick={() => {
                  onConfirmRenewal?.(competence, newIssueDate)
                }}
                sx={primaryButtonSx}
              >
                {t('qualifications.detail.confirmRenewal')}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Renewal plan */}
        <Box
          sx={{
            ...cardSx,
            flex: '0 1 340px',
            minWidth: 280,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarMonthIcon sx={{ color: tones.info.main }} />
            <Typography variant="h2" sx={{ color: tones.info.main }}>
              {t('qualifications.detail.renewalPlan')}
            </Typography>
          </Box>
          <Divider />

          {!planEditable ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                textAlign: 'center',
                px: 1,
                py: 3,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 40, color: tones.info.main }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t('qualifications.detail.noPlanTitle')}
              </Typography>
              <Typography variant="caption">
                {t('qualifications.detail.noPlanDescription')}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('qualifications.detail.plannedDate')}
              </Typography>
              <DateField
                value={plannedDate}
                onChange={setPlannedDate}
                label={t('qualifications.detail.plannedDate')}
              />

              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('qualifications.detail.comment')}
              </Typography>
              <TextField
                multiline
                minRows={5}
                fullWidth
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value)
                }}
                slotProps={{
                  htmlInput: {
                    'aria-label': t('qualifications.detail.comment'),
                  },
                }}
                sx={{ '& textarea': { typography: 'body2' } }}
              />

              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('qualifications.detail.renewalStatus')}
              </Typography>
              <Box>
                <StatusChip
                  label={
                    competence.renewalPlan === null
                      ? t('qualifications.renewal.notPlanned')
                      : t('qualifications.detail.planned')
                  }
                  tone="info"
                />
              </Box>

              <Box
                sx={{
                  mt: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  minHeight: 36,
                }}
              >
                <Typography
                  variant="caption"
                  role="status"
                  sx={{ color: tones.danger.main }}
                >
                  {hasUnsavedChanges
                    ? t('qualifications.detail.unsavedChanges')
                    : ''}
                </Typography>
                <Button
                  variant="contained"
                  disabled={!canSavePlan}
                  onClick={() => {
                    onSaveRenewalPlan?.(
                      competence,
                      plannedDate === ''
                        ? null
                        : {
                            renewalDate: plannedDate,
                            renewalComment:
                              comment.trim() === '' ? null : comment,
                          }
                    )
                  }}
                  sx={primaryButtonSx}
                >
                  {t('qualifications.detail.saveChange')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </DialogContent>
  )
}

export default function CompetenceDetailDialog({
  competence,
  qualificationName,
  onClose,
  onSaveRenewalPlan,
  onConfirmRenewal,
}: CompetenceDetailDialogProps) {
  return (
    <Dialog
      open={competence !== null}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      {competence && (
        <CompetenceDetailContent
          key={`${String(competence.competencyId)}-${competence.issueDate ?? ''}-${String(competence.renewalPlan?.id)}`}
          competence={competence}
          qualificationName={qualificationName}
          onClose={onClose}
          onSaveRenewalPlan={onSaveRenewalPlan}
          onConfirmRenewal={onConfirmRenewal}
        />
      )}
    </Dialog>
  )
}
