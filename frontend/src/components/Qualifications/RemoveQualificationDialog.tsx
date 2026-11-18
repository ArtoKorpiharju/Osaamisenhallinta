import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ typography: 'h2', textAlign: 'center', pt: 3 }}>
        {t('qualifications.removeDialog.title')}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          {t('qualifications.removeDialog.message')}
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
          {t('qualifications.removeDialog.confirm')}
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
          {t('qualifications.removeDialog.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
