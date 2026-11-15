import { Alert, Box, Snackbar, Typography } from '@mui/material'
import MyCompetenciesTable from '../../components/Competencies/MyCompetenciesTable'
import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'

export default function EmployeeCompetencies() {
  return (
    <PageContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}></Box>
      <PageTitle>My Competencies</PageTitle>

      <MyCompetenciesTable />
    </PageContainer>
  )
}