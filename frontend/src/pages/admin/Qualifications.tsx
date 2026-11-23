import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import AdminQualificationsTable from '../../components/Qualifications/AdminQualificationsTable'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import { tones } from '../../config/tones'

import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import {
  fetchAdminQualifications,
  type AdminQualification,
} from '../../services/adminQualifications'

export default function AdminQualifications() {
  const { t } = useTranslation()
  const [qualifications, setQualifications] = useState<AdminQualification[] | null>(
    null,
  )
  const [hasError, setHasError] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let active = true

    void fetchAdminQualifications()
      .then((data) => {
        if (active) {
          setQualifications(data)
        }
      })
      .catch(() => {
        if (active) {
          setHasError(true)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const query = search.trim().toLowerCase()
  const filteredQualifications =
    qualifications?.filter((qualification) =>
      qualification.qualificationName.toLowerCase().includes(query),
    ) ?? []

  return (
    <PageContainer>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <div>
          <PageTitle>{t('navigation.qualifications')}</PageTitle>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: 'text.secondary' }}>
            {t('adminQualifications.description', {
              defaultValue: 'Manage qualifications and their competence requirements.',
            })}
          </Typography>
        </div>

        <Button
          component={Link}
          to="/admin/qualifications/new"
          variant="contained"
          sx={{
            bgcolor: tones.info.main,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            borderRadius: 1,
            px: 2,
            py: 1.25,
            '&:hover': {
              bgcolor: tones.info.main,
              boxShadow: 'none',
            },
          }}
        >
          {t('adminQualifications.addButton', {
            defaultValue: '+ Add new qualification',
          })}
        </Button>
      </Stack>

      {hasError && (
        <Alert severity="error">
          {t('adminQualifications.loadError', {
            defaultValue: 'Could not load qualifications.',
          })}
        </Alert>
      )}

      {!hasError && qualifications === null && (
        <Typography role="status">
          {t('adminQualifications.loading', {
            defaultValue: 'Loading qualifications…',
          })}
        </Typography>
      )}

      {qualifications?.length === 0 && (
        <Typography>
          {t('adminQualifications.empty', {
            defaultValue: 'No qualifications found.',
          })}
        </Typography>
      )}

      {qualifications !== null && qualifications.length > 0 && (
  <Stack spacing={2}>
    <Box sx={{ py: 1 }}>
      <TextField
        placeholder={`${t('adminQualifications.search', {
          defaultValue: 'Search qualifications',
        })}…`}
        type="search"
        size="small"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.primary' }} />
              </InputAdornment>
            ),
          },
          htmlInput: {
            'aria-label': t('adminQualifications.search', {
              defaultValue: 'Search qualifications',
            }),
          },
        }}
        sx={{
          width: '100%',
          maxWidth: 400,
          '& .MuiOutlinedInput-root': { height: 32 },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'text.secondary',
          },
        }}
      />
    </Box>

    <Typography variant="body2" color="text.secondary">
      {t('adminQualifications.totalCount', {
        defaultValue: 'Total qualifications: {{total}}',
        total: qualifications.length,
      })}
    </Typography>

      <AdminQualificationsTable
        qualifications={filteredQualifications}
        onDelete={(qualificationId) => {
          setQualifications((current) =>
            current === null
              ? null
              : current.filter(
                  (qualification) =>
                    qualification.qualificationId !== qualificationId,
                ),
          )
        }}
      />
    </Stack>
  )}
</PageContainer>
  )
}