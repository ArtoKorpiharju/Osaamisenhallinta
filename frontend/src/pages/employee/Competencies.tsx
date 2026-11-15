import { Alert } from '@mui/material'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'

import MyCompetenciesTable from '../../components/Competencies/MyCompetenciesTable'
import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import { getApiErrorMessage } from '../../services/api'
import { fetchEmployeeCompetencies } from '../../services/employee/employeeCompetencies'
import { type EmployeeCompetency } from '../../types/overview'

export default function EmployeeCompetencies() {
  const { userId } = useOutletContext<{ userId: number | undefined }>()

  const [competencies, setCompetencies] = useState<EmployeeCompetency[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
      <PageTitle>My Competencies</PageTitle>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && userId !== undefined && (
        <Alert severity="info">Fetching competencies…</Alert>
      )}

      <MyCompetenciesTable competencies={competencies} />
    </PageContainer>
  )
}