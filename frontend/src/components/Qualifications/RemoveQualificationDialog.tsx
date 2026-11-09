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
 
interface RemoveQualificationDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}
 
export default function RemoveQualificationDialog({
  open,
  onConfirm,
  onCancel,
}: RemoveQualificationDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, pt: 3 }}>
        Remove Qualification?
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ textAlign: 'center', fontSize: 14 }}>
          This qualification will be removed from My Qualifications -list
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 4, pb: 3, pt: 2 }}>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            textTransform: 'none',
            borderRadius: 5,
            px: 4,
            bgcolor: tones.info.main,
          }}
        >
          Remove
        </Button>
        <Button
          variant="contained"
          onClick={onCancel}
          sx={{
            textTransform: 'none',
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
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
 