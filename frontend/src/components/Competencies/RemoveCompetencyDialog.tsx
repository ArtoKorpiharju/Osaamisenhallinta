import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import { tones } from '../../config/tones'

interface RemoveCompetencyDialogProps {
  open: boolean
  competencyName?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function RemoveCompetencyDialog({
  open,
  competencyName,
  onConfirm,
  onCancel,
}: RemoveCompetencyDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ typography: 'h5', textAlign: 'center', pt: 3 }}>
        Remove Competency?
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          {competencyName ?? ''} will be removed from My Competencies -list
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 4, pb: 3, pt: 2 }}>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            borderRadius: 5,
            px: 4,
            bgcolor: tones.info.main,
          }}
        >
          Poista
        </Button>

        <Button
          variant="contained"
          onClick={onCancel}
          sx={{
            borderRadius: 5,
            px: 4,
            bgcolor: tones.info.background,
            color: 'text.primary',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: alpha(tones.info.main, 0.2),
              boxShadow: 'none',
            },
          }}
        >
          Peruuta
        </Button>
      </DialogActions>
    </Dialog>
  )
}
