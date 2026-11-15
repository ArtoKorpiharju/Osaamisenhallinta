import { type ReactNode, useMemo, useState } from 'react'

import { alpha } from '@mui/material/styles'
import { Box, Chip, InputAdornment, TextField, Typography } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'

import { competencyTypeLabels } from '../../config/competency'
import { tones } from '../../config/tones'
import {
  type CompetencyType,
  type EmployeeCompetency,
} from '../../types/overview'

type TypeFilter = CompetencyType | 'all'

// Order of the type chips after the "All" chip.
const typeOrder: CompetencyType[] = [
  'certification',
  'license',
  'skill',
  'training',
  'other',
]

interface SearchCompetenceProps {
  competencies: readonly EmployeeCompetency[]
  // Receives the competencies that match the search and the selected chip.
  // Render the table (or any other list) with them.
  children: (filtered: EmployeeCompetency[]) => ReactNode
}

export default function SearchCompetence({
  competencies,
  children,
}: SearchCompetenceProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  // Chip counts follow the search text, so numbers match what the table shows.
  const matchingSearch = useMemo(() => {
    const query = search.trim().toLowerCase()

    return competencies.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        competencyTypeLabels[c.type].toLowerCase().includes(query)
    )
  }, [competencies, search])

  const counts = useMemo(() => {
    const result: Record<CompetencyType, number> = {
      training: 0,
      license: 0,
      certification: 0,
      skill: 0,
      other: 0,
    }
    for (const c of matchingSearch) {
      result[c.type]++
    }
    return result
  }, [matchingSearch])

  const filtered = useMemo(
    () =>
      typeFilter === 'all'
        ? [...matchingSearch]
        : matchingSearch.filter((c) => c.type === typeFilter),
    [matchingSearch, typeFilter]
  )

  const chips: { value: TypeFilter; label: string }[] = [
    {
      value: 'all',
      label: `All (${String(matchingSearch.length)})`,
    },
    // Only show types that have at least one competence.
    ...typeOrder
      .filter((type) => counts[type] > 0)
      .map((type) => ({
        value: type,
        label: `${competencyTypeLabels[type]} (${String(counts[type])})`,
      })),
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ fontSize: 13 }}>
        View and manage your training, certificates, licences and other
        competences
      </Typography>

      <TextField
        size="small"
        placeholder="Search by name or type...."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-label': 'Search competences' },
        }}
        sx={{ maxWidth: 480, bgcolor: 'action.hover' }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {chips.map((chip) => {
          const selected = typeFilter === chip.value

          return (
            <Chip
              key={chip.value}
              label={chip.label}
              clickable
              onClick={() => {
                setTypeFilter(chip.value)
              }}
              aria-pressed={selected}
              sx={{
                fontWeight: 700,
                fontSize: 12,
                bgcolor: selected ? tones.info.main : 'background.paper',
                color: selected ? '#ffffff' : 'text.primary',
                border: `1px solid ${alpha(tones.info.main, 0.3)}`,
                '&:hover': {
                  bgcolor: selected
                    ? tones.info.main
                    : alpha(tones.info.main, 0.08),
                },
              }}
            />
          )
        })}
      </Box>

      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
        {filtered.length} {filtered.length === 1 ? 'Competence' : 'Competences'}
      </Typography>

      {children(filtered)}
    </Box>
  )
}
