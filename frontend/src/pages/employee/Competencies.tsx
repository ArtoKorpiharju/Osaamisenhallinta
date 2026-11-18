import { Box, Alert, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'

import MyCompetenciesTable from '../../components/Competencies/MyCompetenciesTable'
import RemoveCompetencyDialog from '../../components/Competencies/RemoveCompetencyDialog'
import SearchCompetence from '../../components/Competencies/SearchCompetence'
import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import { getApiErrorMessage } from '../../services/api'
import { fetchCompetencies} from '../../services/competencies'
import { fetchEmployeeCompetencies, deleteEmployeeCompetency
} from '../../services/employee/employeeCompetencies'
import { type EmployeeCompetency } from '../../types/overview'
import ExploreCompetencies, {
  type CatalogueCompetency,
} from '../../components/Competencies/ExploreCompetencies'

export default function EmployeeCompetencies() {
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
          getApiErrorMessage(err, 'Could not load competency catalogue')
        )
      })
  }, [])

  useEffect(() => {
    if (userId === undefined) return

    fetchEmployeeCompetencies(userId)
      .then(setCompetencies)
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(err, 'Could not load competencies', {
            404: 'Competencies could not be found',
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

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
          getApiErrorMessage(err, 'Could not remove competency', {
            404: 'Competency could not be found',
          })
        )
      })
  }

  return (
    <PageContainer>
      <Paper
        variant="outlined"
        square
        sx={{ px: 2, pt: 0.5, pb: 2, borderColor: '#e0e3e8', backgroundColor: '#fff' }}
      >
        <PageTitle>My Competencies</PageTitle>

        {error && <Alert severity="error">{error}</Alert>}
        {loading && userId !== undefined && (
          <Alert severity="info">Fetching competencies…</Alert>
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
        <PageTitle>Explore competencies</PageTitle>

        {catalogueError && <Alert severity="error">{catalogueError}</Alert>}

        <Box>
          <ExploreCompetencies
            competencies={catalogue}
            addedIds={new Set(competencies.map((c) => c.competencyId))}
            onAdd={(c) => {
              console.log('Added competency:', c)
            }}
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