import { Box, Alert, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { useTranslation } from 'react-i18next'

import MyCompetenciesTable from '../../components/Competencies/MyCompetenciesTable'
import RemoveCompetencyDialog from '../../components/Competencies/RemoveCompetencyDialog'
import SearchCompetence from '../../components/Competencies/SearchCompetence'
import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import { getApiErrorMessage } from '../../services/api'
import { fetchCompetencies } from '../../services/competencies'
import { fetchEmployeeCompetencies, deleteEmployeeCompetency, assignCompetency,
} from '../../services/employee/employeeCompetencies'
import { type EmployeeCompetency } from '../../types/overview'
import ExploreCompetencies, {
  type CatalogueCompetency,
} from '../../components/Competencies/ExploreCompetencies'

export default function EmployeeCompetencies() {
  const { t } = useTranslation()
  const { userId } = useOutletContext<{ userId: number | undefined }>()

  const [competencies, setCompetencies] = useState<EmployeeCompetency[]>([])
  const [catalogue, setCatalogue] = useState<CatalogueCompetency[]>([])
  const [error, setError] = useState<string | null>(null)
  const [catalogueError, setCatalogueError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingRemoval, setPendingRemoval] =
    useState<EmployeeCompetency | null>(null)

  // Fetch the whole competency catalogue once.
  useEffect(() => {
    fetchCompetencies()
      .then(setCatalogue)
      .catch((err: unknown) => {
        setCatalogueError(
          getApiErrorMessage(err, t('competencies.errors.loadCatalogue'))
        )
      })
  }, [t])

  useEffect(() => {
    if (userId === undefined) return

    fetchEmployeeCompetencies(userId)
      .then(setCompetencies)
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(err, t('competencies.errors.load'), {
            404: t('competencies.errors.loadNotFound'),
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId, t])

  const handleConfirmRemove = () => {
    const target = pendingRemoval
    setPendingRemoval(null)

    if (target?.employeeCompetencyId == null || userId === undefined) {
      return
    }

    const removedId = target.employeeCompetencyId

    deleteEmployeeCompetency(userId, removedId)
      .then(() => {
        setError(null)
        setCompetencies((current) =>
          current.filter((c) => c.employeeCompetencyId !== removedId)
        )
      })
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(err, t('competencies.errors.remove'), {
            404: t('competencies.errors.removeNotFound'),
          })
        )
      })
  }

  const handleAdd = (competency: CatalogueCompetency, issueDate: string) => {
  if (userId === undefined) return

  assignCompetency(userId, competency.competencyId, issueDate)
    // Reload so the backend-calculated status and expiry date are shown.
    .then(() => fetchEmployeeCompetencies(userId))
    .then((updated) => {
      setError(null)
      setCompetencies(updated)
    })
    .catch((err: unknown) => {
      setError(
        getApiErrorMessage(err, t('competencies.errors.add'), {
          400: t('competencies.errors.addInvalidDate'),
          404: t('competencies.errors.addNotFound'),
          409: t('competencies.errors.addConflict'),
        })
      )
    })
}


  return (
    <PageContainer>
      <Paper
        variant="outlined"
        square
        sx={{
          px: 2,
          pt: 0.5,
          pb: 2,
          borderColor: '#e0e3e8',
          backgroundColor: '#fff',
        }}
      >
        <PageTitle>{t('competencies.my.title')}</PageTitle>

        {error && <Alert severity="error">{error}</Alert>}
        {loading && userId !== undefined && (
          <Alert severity="info">{t('competencies.loading')}</Alert>
        )}

        <SearchCompetence competencies={competencies}>
          {(filtered) => (
            <MyCompetenciesTable
              competencies={filtered}
              onRemove={setPendingRemoval}
            />
          )}
        </SearchCompetence>
      </Paper>

      <Paper variant="outlined" square sx={{ px: 2, pt: 0.5, pb: 2 }}>
        <PageTitle>{t('competencies.explore.title')}</PageTitle>

        {catalogueError && <Alert severity="error">{catalogueError}</Alert>}

        <Box>
          <ExploreCompetencies
            competencies={catalogue}
            addedIds={
              new Set(
                competencies
                  .filter((c) => c.employeeCompetencyId !== null)
                  .map((c) => c.competencyId)
            )
         }
        onAdd={handleAdd}
        />
        </Box>
      </Paper>

      <RemoveCompetencyDialog
        open={pendingRemoval !== null}
        competencyName={pendingRemoval?.name}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setPendingRemoval(null)
        }}
      />
    </PageContainer>
  )
}
