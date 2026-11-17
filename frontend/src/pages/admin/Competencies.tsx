import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
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
import CompetenciesTable, {
  type Competency,
} from '../../components/AdminCompetencies/CompetenciesTable'

// Temporary frontend data. Replace with backend data later.
const Competencies: Competency[] = [
  {
    id: 1,
    competency: 'Magnetic Flux Leakage (MFL)',
    type: 'Training',
    validity: 3,
    update: '16.03.2026',
  },
  {
    id: 2,
    competency: 'First Aid Training',
    type: 'Certificate',
    validity: 5,
    update: '26.03.2026',
  },
  {
    id: 3,
    competency: 'Safety Card',
    type: 'Certificate',
    validity: 3,
    update: '06.06.2026',
  },
]

function AdminCompetencies() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const filteredCompetencies = Competencies.filter((item) =>
    item.competency.toLowerCase().includes(search.trim().toLowerCase())
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
            <PageTitle>Competencies</PageTitle>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: 'text.secondary',
              }}
            >
              Manage competency definitions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              flexShrink: 1,
              mt: '39px',
              textTransform: 'none',
              backgroundColor: '#174f83',
            }}
          >
            Add new competence
          </Button>
        </Box>
      </Box>

      <Box>
        <TextField
          label="Search competencies"
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

        <Typography
          sx={{
            mt: 2,
            fontSize: 13,
            color: 'text.secondary',
          }}
        >
          {filteredCompetencies.length}{' '}
          {filteredCompetencies.length === 1 ? 'Competency' : 'Competencies'}
        </Typography>

        <CompetenciesTable
          items={filteredCompetencies}
          onItemClick={() => {
            void navigate('/admin/competencies')
          }}
        />
      </Box>
    </PageContainer>
  )
}

export default AdminCompetencies
