import { useState } from 'react'
import {
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
import { tones } from '../../config/tones'

interface AddCompetencyPopUpProps {
  open: boolean
  onClose: () => void
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
}: AddCompetencyPopUpProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [validForLimitedTime, setValidForLimitedTime] = useState(true)
  const [validityYears, setValidityYears] = useState('0')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        variant="h2"
        sx={{
          bgcolor: '#e4edf5',
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
              setType(event.target.value)
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
              value={validityYears}
              onChange={(event) => {
                setValidityYears(event.target.value)
              }}
              slotProps={{ htmlInput: { min: 0 } }}
              sx={{ width: 64 }}
            />
            <Typography variant="body1">
              {t('adminCompetencies.dialog.years')}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          {t('adminCompetencies.dialog.cancel')}
        </Button>
        <Button
          type="button"
          variant="contained"
          sx={{
            bgcolor: tones.info.main,
          }}
        >
          {t('adminCompetencies.dialog.add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
