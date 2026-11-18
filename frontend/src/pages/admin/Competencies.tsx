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
import DeleteCompetencyPopUp from '../../components/AdminCompetencies/DeleteCompetencyPopUp'
import { tones } from '../../config/tones'
import { getApiErrorMessage } from '../../services/api'
import {
  createCompetency,
  deleteCompetency,
  fetchAdminCompetencies,
} from '../../services/admin/adminCompetencies'
import {
  type AdminCompetency,
  type CreateAdminCompetencyInput,
} from '../../services/admin/admin'

function AdminCompetencies() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [addCompetencyOpen, setAddCompetencyOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [competencies, setCompetencies] = useState<AdminCompetency[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [competencyToDelete, setCompetencyToDelete] =
    useState<AdminCompetency | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

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

  const handleAddCompetency = async (
    competency: CreateAdminCompetencyInput
  ) => {
    const createdCompetency = await createCompetency(competency)
    setCompetencies((current) => [...current, createdCompetency])
  }

  const closeDeleteDialog = () => {
    if (deleting) return
    setDeleteError(null)
    setCompetencyToDelete(null)
  }

  const handleDeleteCompetency = async () => {
    if (competencyToDelete === null) return

    const competency = competencyToDelete
    setDeleteError(null)
    setDeleting(true)

    try {
      await deleteCompetency(competency.id)
      setCompetencies((current) =>
        current.filter((item) => item.id !== competency.id)
      )
      setCompetencyToDelete(null)
    } catch (deleteError: unknown) {
      setDeleteError(
        getApiErrorMessage(deleteError, t('adminCompetencies.errors.delete'), {
          400: t('adminCompetencies.errors.deleteBadRequest'),
          404: t('adminCompetencies.errors.deleteNotFound'),
          409: t('adminCompetencies.errors.inUse'),
        })
      )
    } finally {
      setDeleting(false)
    }
  }

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
              deleting={deleting}
              onItemClick={() => {
                void navigate('/admin/competencies')
              }}
              onDelete={(competency) => {
                setDeleteError(null)
                setCompetencyToDelete(competency)
              }}
            />
          </>
        )}
      </Box>
      <AddCompetencyPopUp
        open={addCompetencyOpen}
        onAdd={handleAddCompetency}
        onClose={() => {
          setAddCompetencyOpen(false)
        }}
      />
      <DeleteCompetencyPopUp
        competency={competencyToDelete}
        deleting={deleting}
        error={deleteError}
        onClose={closeDeleteDialog}
        onConfirm={() => {
          void handleDeleteCompetency()
        }}
      />
    </PageContainer>
  )
}

export default AdminCompetencies
