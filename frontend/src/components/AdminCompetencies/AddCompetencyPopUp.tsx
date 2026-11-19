import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { CompetencyType } from '../../types/overview'
import { headerBackground, tones } from '../../config/tones'
import { getApiErrorMessage } from '../../services/api'
import type { CreateAdminCompetencyInput } from '../../services/admin/admin'

interface AddCompetencyPopUpProps {
  open: boolean
  onClose: () => void
  onAdd: (competency: CreateAdminCompetencyInput) => Promise<void>
}

const competencyTypes: CompetencyType[] = [
  'training',
  'license',
  'certificate',
  'skill',
  'other',
]

export default function AddCompetencyPopUp({
  open,
  onClose,
  onAdd,
}: AddCompetencyPopUpProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [type, setType] = useState<CompetencyType | ''>('')
  const [validForLimitedTime, setValidForLimitedTime] = useState(true)
  const [validityMonths, setValidityMonths] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = async () => {
    setError(null)
    const months = Number(validityMonths)

    if (
      !name.trim() ||
      type === '' ||
      (validForLimitedTime && (!Number.isInteger(months) || months < 1))
    ) {
      setError(t('adminCompetencies.errors.validation'))
      return
    }

    setSubmitting(true)
    try {
      await onAdd({
        name: name.trim(),
        type,
        validityMonths: validForLimitedTime ? months : null,
      })
      setName('')
      setType('')
      setValidForLimitedTime(true)
      setValidityMonths('1')
      onClose()
    } catch (submitError: unknown) {
      setError(
        getApiErrorMessage(submitError, t('adminCompetencies.errors.create'), {
          400: t('adminCompetencies.errors.createBadRequest'),
          409: t('adminCompetencies.errors.conflict'),
        })
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        variant="h2"
        sx={{
          bgcolor: headerBackground,
          color: tones.info.main,
        }}
      >
        {t('adminCompetencies.dialog.title')}
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          '&:first-of-type': { pt: 3 },
        }}
      >
        <Box>
          <Typography component="div" variant="subtitle1" sx={{ mb: 0.5 }}>
            {t('adminCompetencies.dialog.name')}{' '}
            <Box component="span" sx={{ color: tones.danger.main }}>
              *
            </Box>
          </Typography>
          <TextField
            fullWidth
            required
            size="small"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError(null)
            }}
          />
        </Box>

        <Box>
          <Typography component="div" variant="subtitle1" sx={{ mb: 0.5 }}>
            {t('adminCompetencies.dialog.type')}{' '}
            <Box component="span" sx={{ color: tones.danger.main }}>
              *
            </Box>
          </Typography>
          <TextField
            fullWidth
            required
            select
            size="small"
            value={type}
            onChange={(event) => {
              const selectedType = competencyTypes.find(
                (competencyType) => competencyType === event.target.value
              )
              setType(selectedType ?? '')
              setError(null)
            }}
          >
            {competencyTypes.map((competencyType) => (
              <MenuItem key={competencyType} value={competencyType}>
                {t(`adminCompetencies.types.${competencyType}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <FormControl>
          <Typography component="div" variant="subtitle1">
            {t('adminCompetencies.dialog.validity')}{' '}
            <Box component="span" sx={{ color: tones.danger.main }}>
              *
            </Box>
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={validForLimitedTime}
                onChange={(event) => {
                  setValidForLimitedTime(event.target.checked)
                  setError(null)
                }}
              />
            }
            label={t('adminCompetencies.dialog.limitedTime')}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={!validForLimitedTime}
                onChange={(event) => {
                  setValidForLimitedTime(!event.target.checked)
                  setError(null)
                }}
              />
            }
            label={t('adminCompetencies.dialog.noExpiry')}
          />
        </FormControl>

        {validForLimitedTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">
              {t('adminCompetencies.dialog.validFor')}
            </Typography>
            <TextField
              type="number"
              size="small"
              value={validityMonths}
              onChange={(event) => {
                setValidityMonths(event.target.value)
                setError(null)
              }}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
              sx={{ width: 64 }}
            />
            <Typography variant="body1">
              {t('adminCompetencies.dialog.month', {
                count: Number(validityMonths),
              })}
            </Typography>
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={submitting}
        >
          {t('adminCompetencies.dialog.cancel')}
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={() => {
            void handleAdd()
          }}
          disabled={submitting}
          sx={{
            bgcolor: tones.info.main,
          }}
        >
          {submitting
            ? t('adminCompetencies.dialog.adding')
            : t('adminCompetencies.dialog.add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
