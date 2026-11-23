import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { useTranslation } from 'react-i18next'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import type {} from '@mui/x-data-grid/themeAugmentation'
import { useNavigate } from 'react-router'

import {
  qualificationListHeaderBackground,
  tones,
} from '../../config/tones'
import DataTable, { type DataTableColumn } from '../DataTable'
import type { AdminQualification } from '../../services/adminQualifications'

interface AdminQualificationsTableProps {
  qualifications: AdminQualification[]
  onDelete: (qualificationId: number) => void
}

interface QualificationRow {
  qualificationId: number
  qualificationName: string
  requiredCompetencyCount: number
}

function NoMatchingQualifications() {
  const { t } = useTranslation()

  return (
    <Box role="status" sx={{ px: 3, py: 2, typography: 'body2' }}>
      {t('adminQualifications.noSearchResults', {
        defaultValue: 'No qualifications match your search.',
      })}
    </Box>
  )
}

export default function AdminQualificationsTable({
  qualifications,
  onDelete,
}: AdminQualificationsTableProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const outerTheme = useTheme()

  const tableTheme = createTheme(outerTheme, {
    palette: {
      DataGrid: {
        headerBg: qualificationListHeaderBackground,
      },
    },
  })

  const [qualificationToDelete, setQualificationToDelete] =
    useState<QualificationRow | null>(null)

  const closeDeleteDialog = () => {
    setQualificationToDelete(null)
  }

  const confirmDelete = () => {
    if (qualificationToDelete === null) {
      return
    }

    onDelete(qualificationToDelete.qualificationId)
    closeDeleteDialog()
  }

  const rows: QualificationRow[] = qualifications.map((qualification) => ({
    qualificationId: qualification.qualificationId,
    qualificationName: qualification.qualificationName,
    requiredCompetencyCount: qualification.requiredCompetencies.length,
  }))

  const columns: DataTableColumn<QualificationRow>[] = [
    {
      id: 'qualificationName',
      label: t('adminQualifications.columns.name', {
        defaultValue: 'Qualification',
      }),
      minWidth: 180,
      render: (row) => (
        <Box component="span" sx={{ fontWeight: 600 }}>
          {row.qualificationName}
        </Box>
      ),
    },
    {
      id: 'requiredCompetencyCount',
      label: t('adminQualifications.columns.requiredCompetencies', {
        defaultValue: 'Required competencies',
      }),
      minWidth: 180,
      render: (row) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            gap: 2,
          }}
        >
          <span>{row.requiredCompetencyCount}</span>

          <IconButton
            size="small"
            aria-label={t('adminQualifications.deleteButton', {
              defaultValue: 'Delete {{name}}',
              name: row.qualificationName,
            })}
            onClick={(event) => {
              event.stopPropagation()
              setQualificationToDelete(row)
            }}
            sx={{ color: 'text.secondary' }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
      <ThemeProvider theme={tableTheme}>
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid',
            borderColor: tones.info.background,
          },
          '& .MuiDataGrid-columnHeader': {
            color: tones.info.main,
          },
          '& .MuiDataGrid-root .MuiDataGrid-columnHeaderTitle': {
            fontSize: 18,
            fontWeight: 700,
          },
          '& .MuiDataGrid-root .MuiDataGrid-columnHeader, & .MuiDataGrid-root .MuiDataGrid-cell': {
            px: 3,
          },

          // Remove the outline around an individual cell.
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },

          // Show the outline around the whole row instead.
          '& .MuiDataGrid-row:focus-within': {
            outline: `2px solid ${tones.info.main}`,
            outlineOffset: -2,
          },
        }}
      >
                <DataTable
          columns={columns}
          rows={rows}
          getRowId={(row) => row.qualificationId}
          noRowsOverlay={NoMatchingQualifications}
          onRowClick={(row) => {
            void navigate(
              `/admin/qualifications/${String(row.qualificationId)}/edit`,
            )
          }}
        />
      </Box>

      <Dialog
        open={qualificationToDelete !== null}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-qualification-title"
        aria-describedby="delete-qualification-name"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="delete-qualification-title"
          sx={{
            typography: 'subtitle1',
            fontWeight: 600,
            color: tones.info.main,
          }}
        >
          {t('adminQualifications.deleteDialog.title', {
            defaultValue:
              'Are you sure you want to delete this qualification?',
          })}
        </DialogTitle>

        <DialogContent>
          <Typography
            id="delete-qualification-name"
            variant="subtitle2"
            sx={{ overflowWrap: 'anywhere' }}
          >
            {qualificationToDelete?.qualificationName}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            autoFocus
            variant="outlined"
            onClick={closeDeleteDialog}
            sx={{
              color: tones.info.main,
              borderColor: tones.info.main,
              textTransform: 'none',
            }}
          >
            {t('adminQualifications.deleteDialog.no', {
              defaultValue: 'No',
            })}
          </Button>

          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              bgcolor: tones.info.main,
              textTransform: 'none',
              '&:hover': {
                bgcolor: tones.info.main,
              },
            }}
          >
            {t('adminQualifications.deleteDialog.yes', {
              defaultValue: 'Yes',
            })}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}