import {Box, Alert, Typography, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'

import MyCompetenciesTable from '../../components/Competencies/MyCompetenciesTable'
import SearchCompetence from '../../components/Competencies/SearchCompetence'
import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import { getApiErrorMessage } from '../../services/api'
import { fetchEmployeeCompetencies } from '../../services/employee/employeeCompetencies'
import { type EmployeeCompetency } from '../../types/overview'
import ExploreCompetencies, {type CatalogueCompetency,} from '../../components/Competencies/ExploreCompetencies'

export default function EmployeeCompetencies() {
  const { userId } = useOutletContext<{ userId: number | undefined }>()

  const [competencies, setCompetencies] = useState<EmployeeCompetency[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  //kovakoodattua dataa poista lopullisesta
  const catalogue: CatalogueCompetency[] = [
  { competencyId: 1, name: 'React Development', type: 'skill' },
  { competencyId: 2, name: 'TypeScript', type: 'skill' },
  { competencyId: 3, name: 'Project Management', type: 'training' },
  { competencyId: 4, name: 'First Aid Certificate', type: 'certification' },
  { competencyId: 5, name: 'Driving Licence B', type: 'license' },
  { competencyId: 6, name: 'Cloud Architecture', type: 'skill' },
]
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

  return (
    <PageContainer>
      <Paper
      variant="outlined"
      square
      sx={{
        px: 2,
        pt: 0.5,
        pb: 2,
        db: 1,
        borderColor: '#e0e3e8',
        backgroundColor: '#fff',
      }}
      >
      <PageTitle>My Competencies</PageTitle>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && userId !== undefined && (
        <Alert severity="info">Fetching competencies…</Alert>
      )}
      
      <SearchCompetence competencies={competencies}>
        {(filtered) => <MyCompetenciesTable competencies={filtered} />}
      </SearchCompetence>
      </Paper>

      <Paper
      variant="outlined"
      square
      sx={{
        px: 2,
        pt: 0.5,
        pb: 2,
        b: 2,
        }}
      >
      <PageTitle> Explore competencies</PageTitle>

      <ExploreCompetencies
        competencies={catalogue}
        addedIds={new Set(competencies.map((c) => c.competencyId))}
        onAdd={(c) => {
        console.log('Added competency:', c)
        }}
      />
      </Paper>

    </PageContainer>
  )
}