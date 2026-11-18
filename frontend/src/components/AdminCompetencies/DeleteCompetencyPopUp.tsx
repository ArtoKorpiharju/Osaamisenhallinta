import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { tones } from '../../config/tones'
import { type AdminCompetency } from '../../services/admin/admin'

interface DeleteCompetencyPopUpProps {
  competency: AdminCompetency | null
  deleting: boolean
  error: string | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteCompetencyPopUp({
  competency,
  deleting,
  error,
  onClose,
  onConfirm,
}: DeleteCompetencyPopUpProps) {
  const { t } = useTranslation()

  return (
    <Dialog
      open={competency !== null}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        variant="h2"
        sx={{
          bgcolor: '#e4edf5',
          color: tones.info.main,
        }}
      >
        {t('adminCompetencies.deleteDialog.title')}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&:first-of-type': { pt: 3 },
        }}
      >
        <Typography>
          {t('adminCompetencies.deleteDialog.message', {
            name: competency?.name ?? '',
          })}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={deleting}
        >
          {t('adminCompetencies.deleteDialog.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={deleting || competency === null}
          sx={{ bgcolor: tones.danger.main }}
        >
          {deleting
            ? t('adminCompetencies.deleteDialog.deleting')
            : t('adminCompetencies.deleteDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
