import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
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
import AddCompetencyPopUp from '../../components/AdminCompetencies/AddCompetencyPopUp'
import { tones } from '../../config/tones'

// Temporary frontend data. Replace with backend data later.
const Competencies: Competency[] = [
  {
    id: 1,
    competency: 'Magnetic Flux Leakage (MFL)',
    type: 'Training',
    validity: 3,
  },
  {
    id: 2,
    competency: 'First Aid Training',
    type: 'Certificate',
    validity: 5,
  },
  {
    id: 3,
    competency: 'Safety Card',
    type: 'Certificate',
    validity: 3,
  },
]

function AdminCompetencies() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [addCompetencyOpen, setAddCompetencyOpen] = useState(false)
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
