import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'

import PageTitle from '../../components/PageTitle'
import PageContainer from '../../components/PageContainer'
import CompetenciesTable from '../../components/AdminCompetencies/CompetenciesTable'
import AddCompetencyPopUp from '../../components/AdminCompetencies/AddCompetencyPopUp'
import { tones } from '../../config/tones'
import { getApiErrorMessage } from '../../services/api'
import { fetchAdminCompetencies } from '../../services/admin/adminCompetencies'
import { type AdminCompetency } from '../../services/admin/admin'

function AdminCompetencies() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [addCompetencyOpen, setAddCompetencyOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [competencies, setCompetencies] = useState<AdminCompetency[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminCompetencies()
      .then(setCompetencies)
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(err, t('adminCompetencies.errors.load'), {
            400: t('adminCompetencies.errors.badRequest'),
            404: t('adminCompetencies.errors.notFound'),
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [t])

  const filteredCompetencies = competencies.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <PageContainer>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <PageTitle>{t('adminCompetencies.title')}</PageTitle>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: 'text.secondary',
              }}
            >
              {t('adminCompetencies.description')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setAddCompetencyOpen(true)
            }}
            sx={{
              flexShrink: 1,
              mt: '30px',
              backgroundColor: tones.info.main,
            }}
          >
            {t('adminCompetencies.addButton')}
          </Button>
        </Box>
      </Box>

      <Box>
        <TextField
          label={t('adminCompetencies.searchLabel')}
          size="small"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ my: 2, width: { xs: '100%', sm: 400 } }}
        />

        {loading && (
          <Alert severity="info">{t('adminCompetencies.loading')}</Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && error === null && (
          <>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: 'text.secondary',
              }}
            >
              {t('adminCompetencies.resultCount', {
                count: filteredCompetencies.length,
              })}
            </Typography>

            <CompetenciesTable
              items={filteredCompetencies}
              onItemClick={() => {
                void navigate('/admin/competencies')
              }}
            />
          </>
        )}
      </Box>
      <AddCompetencyPopUp
        open={addCompetencyOpen}
        onClose={() => {
          setAddCompetencyOpen(false)
        }}
      />
    </PageContainer>
  )
}

export default AdminCompetencies
