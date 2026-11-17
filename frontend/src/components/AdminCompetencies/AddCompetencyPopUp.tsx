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

import type { CompetencyType } from '../../types/overview'

interface AddCompetencyPopUpProps {
  open: boolean
  onClose: () => void
}

const competencyTypes: { value: CompetencyType; label: string }[] = [
  { value: 'training', label: 'Training' },
  { value: 'license', label: 'License' },
  { value: 'certification', label: 'Certification' },
  { value: 'skill', label: 'Skill' },
  { value: 'other', label: 'Other' },
]

export default function AddCompetencyPopUp({
  open,
  onClose,
}: AddCompetencyPopUpProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [validForLimitedTime, setValidForLimitedTime] = useState(true)
  const [validityYears, setValidityYears] = useState('0')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: '#e6eef5',
          color: '#174f83',
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        Add competence
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
          <Typography
            component="div"
            sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}
          >
            Name{' '}
            <Box component="span" sx={{ color: 'error.main' }}>
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
          <Typography
            component="div"
            sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}
          >
            Type{' '}
            <Box component="span" sx={{ color: 'error.main' }}>
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
              <MenuItem key={competencyType.value} value={competencyType.value}>
                {competencyType.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <FormControl>
          <Typography component="div" sx={{ fontSize: 14, fontWeight: 600 }}>
            Validity{' '}
            <Box component="span" sx={{ color: 'error.main' }}>
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
            label="Valid for a limited time"
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
            label="Does not expire"
          />
        </FormControl>

        {validForLimitedTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 14 }}>Valid for</Typography>
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
            <Typography sx={{ fontSize: 14 }}>Years</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button type="button" variant="contained">
          Add competence
        </Button>
      </DialogActions>
    </Dialog>
  )
}
