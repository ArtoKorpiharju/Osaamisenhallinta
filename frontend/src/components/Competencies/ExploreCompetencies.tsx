import { useMemo, useState } from 'react'

import { alpha } from '@mui/material/styles'
import {Box,Button,Chip,InputAdornment,MenuItem,Pagination,Select,TextField,
        Tooltip,Typography,} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

import ExpandableTable, { type ExpandableTableColumn, type SortState,} 
from '../ExpandableTable'
import CompetenceDetailDialog from '../Qualifications/CompetenceDetailDialog'
import { tones } from '../../config/tones'
import {type CompetencyType, type EmployeeCompetency,
} from '../../types/overview'


// A competency from the whole system catalogue (not only the employee's own).
export interface CatalogueCompetency {
  competencyId: number
  name: string
  type: CompetencyType
}

type TypeFilter = CompetencyType | 'all'

// Order of the chips after "All". These are always shown, even with 0 matches.
const alwaysShownTypes: CompetencyType[] = [
  'certification',
  'license',
  'skill',
  'training',
]

interface ExploreCompetenciesProps {
  competencies: readonly CatalogueCompetency[]
  // Ids of competencies that the employee already has.
  addedIds: ReadonlySet<number>
  // Called after the user has confirmed the issue date in the dialog.
  onAdd: (competency: CatalogueCompetency, issueDate: string) => void
}

export default function ExploreCompetencies({
  competencies,
  addedIds,
  onAdd,
}: ExploreCompetenciesProps) {
  const { t, i18n } = useTranslation()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sort, setSort] = useState<SortState>({ by: 'name', direction: 'asc' })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(4)
  // The competency whose detail dialog is open.
  const [selected, setSelected] = useState<CatalogueCompetency | null>(null)

  // Labels used in the type column and in the filter chips.
  const typeLabel = (type: CompetencyType) =>
    t(`competencies.explore.types.${type}`)

  // Chip counts follow the search text, so numbers match what the table shows.
  const matchingSearch = useMemo(() => {
    const query = search.trim().toLowerCase()

    return competencies.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        t(`competencies.explore.types.${c.type}`).toLowerCase().includes(query)
    )
  }, [competencies, search, t])

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

  // Filter and sort the whole list first, then take one page.
  const visible = useMemo(() => {
    const filtered =
      typeFilter === 'all'
        ? [...matchingSearch]
        : matchingSearch.filter((c) => c.type === typeFilter)

    const getValue = (c: CatalogueCompetency) =>
      sort.by === 'type' ? t(`competencies.explore.types.${c.type}`) : c.name

    const sorted = filtered.sort((a, b) =>
      getValue(a).localeCompare(getValue(b), i18n.language, {
        numeric: true,
        sensitivity: 'base',
      })
    )

    return sort.direction === 'asc' ? sorted : sorted.reverse()
  }, [matchingSearch, typeFilter, sort.by, sort.direction, t, i18n.language])

  const pageCount = Math.max(1, Math.ceil(visible.length / rowsPerPage))
  const pageRows = visible.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

  const chips: { value: TypeFilter; label: string }[] = [
    {
      value: 'all',
      label: `${t('competencies.filters.all')} (${String(matchingSearch.length)})`,
    },
    ...alwaysShownTypes.map((type) => ({
      value: type,
      label: `${typeLabel(type)} (${String(counts[type])})`,
    })),
    // "Other" is only shown when there is something in it.
    ...(counts.other > 0
      ? [
          {
            value: 'other' as const,
            label: `${typeLabel('other')} (${String(counts.other)})`,
          },
        ]
      : []),
  ]

  const columns: ExpandableTableColumn<CatalogueCompetency>[] = [
    {
      id: 'name',
      label: t('competencies.explore.columns.name'),
      width: '45%',
      // Only marks the column as sortable, the sorting itself is done above.
      sortValue: (c) => c.name,
      render: (c) => c.name,
    },
    {
      id: 'type',
      label: t('competencies.explore.columns.type'),
      align: 'center',
      width: '30%',
      render: (c) => typeLabel(c.type),
    },
    {
      id: 'action',
      label: t('competencies.explore.columns.action'),
      align: 'center',
      width: '25%',
      render: (c) => {
        const added = addedIds.has(c.competencyId)

        return (
          <Tooltip title={added ? '' : t('competencies.explore.addTooltip')}>
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={added ? undefined : <AddIcon />}
                disabled={added}
                onClick={(event) => {
                  event.stopPropagation()
                  // Open the detail dialog, the competency is added on confirm.
                  setSelected(c)
                }}
                sx={{
                  textTransform: 'none',
                  borderRadius: 5,
                  fontWeight: 700,
                  borderColor: tones.info.main,
                  color: tones.info.main,
                }}
              >
                {added
                  ? t('competencies.explore.added')
                  : t('competencies.explore.add')}
              </Button>
            </span>
          </Tooltip>
        )
      },
    },
  ]

  // The employee does not have this competency yet, so the dialog gets an
  // empty one (no id, no dates). The dialog then shows "No renewal plan
  // available" and the "New issue date" field.
  const dialogCompetence: EmployeeCompetency | null = selected
    ? {
        employeeCompetencyId: null,
        competencyId: selected.competencyId,
        name: selected.name,
        type: selected.type,
        issueDate: null,
        expirationDate: null,
        status: 'missing',
        renewalPlan: null,
      }
    : null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ fontSize: 13 }}>
        {t('competencies.explore.description')}
      </Typography>

      <TextField
        size="small"
        placeholder={t('competencies.explore.searchPlaceholder')}
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          setPage(0)
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-label': t('competencies.explore.searchAriaLabel') },
        }}
        sx={{ maxWidth: 480, bgcolor: 'action.hover' }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {chips.map((chip) => {
          const selectedChip = typeFilter === chip.value

          return (
            <Chip
              key={chip.value}
              label={chip.label}
              clickable
              onClick={() => {
                setTypeFilter(chip.value)
                setPage(0)
              }}
              aria-pressed={selectedChip}
              sx={{
                fontWeight: 700,
                fontSize: 12,
                bgcolor: selectedChip ? tones.info.main : 'background.paper',
                color: selectedChip ? '#ffffff' : 'text.primary',
                border: `1px solid ${alpha(tones.info.main, 0.3)}`,
                '&:hover': {
                  bgcolor: selectedChip
                    ? tones.info.main
                    : alpha(tones.info.main, 0.08),
                },
              }}
            />
          )
        })}
      </Box>

      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
        {t('competencies.count', { count: visible.length })}
      </Typography>

      <Box
        sx={{
          border: `1px solid ${alpha(tones.info.main, 0.3)}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <ExpandableTable
          ariaLabel={t('competencies.explore.tableAriaLabel')}
          rows={pageRows}
          columns={columns}
          getRowId={(c) => String(c.competencyId)}
          sort={sort}
          onSortChange={(next) => {
            setSort(next)
            setPage(0)
          }}
          emptyMessage={t('competencies.explore.empty')}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 12 }}>
            {t('competencies.explore.rowsPerPage')}
          </Typography>
          <Select
            size="small"
            variant="standard"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(event.target.value)
              setPage(0)
            }}
            inputProps={{
              'aria-label': t('competencies.explore.rowsPerPage'),
            }}
            sx={{ fontSize: 12 }}
          >
            {[4, 8, 12].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Pagination
          size="small"
          shape="rounded"
          count={pageCount}
          page={page + 1}
          onChange={(_event, newPage) => {
            setPage(newPage - 1)
          }}
          sx={{
            '& .Mui-selected': {
              bgcolor: tones.info.main,
              color: '#ffffff',
              '&:hover': { bgcolor: tones.info.main },
            },
          }}
        />
      </Box>

      {/* Same detail dialog as in Qualifications, opened from the Add button. */}
      <CompetenceDetailDialog
        competence={dialogCompetence}
        qualificationName={t('competencies.explore.title')}
        onClose={() => {
          setSelected(null)
        }}
        onConfirmRenewal={(_competence, newIssueDate) => {
          if (selected) onAdd(selected, newIssueDate)
          setSelected(null)
        }}
      />
    </Box>
  )
}
