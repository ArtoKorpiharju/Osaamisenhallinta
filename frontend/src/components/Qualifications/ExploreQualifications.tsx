import { useMemo, useState } from 'react'

import { alpha } from '@mui/material/styles'
import {
  Box,
  Button,
  InputAdornment,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import SearchIcon from '@mui/icons-material/Search'

import CriticalBadge from '../CriticalBadge'
import ExpandableTable, {
  type ExpandableTableColumn,
  type SortState,
} from '../ExpandableTable'
import Panel from '../Panel'
import { tones } from '../../config/tones'
import { type EmployeeCompetency } from '../../types/overview'
import { type CatalogueQualification } from '../../types/qualifications'
import CompetenceList from './CompetenceList'

interface ExploreQualificationsProps {
  qualifications: readonly CatalogueQualification[]
  // Ids of qualifications that are already in My Qualifications.
  addedIds: ReadonlySet<number>
  onAdd: (qualification: CatalogueQualification) => void
  onCompetenceClick: (
    competence: EmployeeCompetency,
    qualification: CatalogueQualification
  ) => void
}

// Sortable values per column id. Add an entry here when a column gets sortValue.
const sortValues: Record<
  string,
  (q: CatalogueQualification) => string | number
> = {
  name: (q) => q.name,
}

export default function ExploreQualifications({
  qualifications,
  addedIds,
  onAdd,
  onCompetenceClick,
}: ExploreQualificationsProps) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>({ by: 'name', direction: 'asc' })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(4)

  // Filter and sort the whole list first, then take one page.
  // Sorting only the visible page would give a wrong order.
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    const getValue = sortValues[sort.by ?? 'name'] ?? sortValues.name
    const sorted = qualifications
      .filter((q) => q.name.toLowerCase().includes(query))
      .sort((a, b) =>
        String(getValue(a)).localeCompare(String(getValue(b)), 'fi', {
          numeric: true,
          sensitivity: 'base',
        })
      )
    return sort.direction === 'asc' ? sorted : sorted.reverse()
  }, [qualifications, search, sort.by, sort.direction])

  const pageRows = visible.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

  const columns: ExpandableTableColumn<CatalogueQualification>[] = [
    {
      id: 'name',
      label: 'Qualifications',
      width: '38%',
      // Only marks the column as sortable, the sorting itself is done above.
      sortValue: sortValues.name,
      render: (q, { expanded }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flexShrink: 0, width: 88 }}>
            {q.isCritical && <CriticalBadge />}
          </Box>
          {q.name}
          <ArrowRightIcon
            fontSize="small"
            aria-hidden
            sx={{
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
        </Box>
      ),
    },
    {
      id: 'requirements',
      label: 'Requirements met',
      align: 'center',
      width: '34%',
      render: (q) =>
        `${q.requirementsMet.toString()}/${q.requirementsTotal.toString()}`,
    },
    {
      id: 'action',
      label: 'Action',
      align: 'center',
      width: '28%',
      render: (q) => {
        const added = addedIds.has(q.qualificationId)
        return (
          <Tooltip title={added ? '' : 'Add to My Qualifications'}>
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={added ? undefined : <AddIcon />}
                disabled={added}
                onClick={(event) => {
                  // Do not expand the row.
                  event.stopPropagation()
                  onAdd(q)
                }}
                sx={{
                  textTransform: 'none',
                  borderRadius: 5,
                  fontWeight: 700,
                  borderColor: tones.info.main,
                  color: tones.info.main,
                }}
              >
                {added ? 'Added' : 'Add'}
              </Button>
            </span>
          </Tooltip>
        )
      },
    },
  ]

  return (
    <Panel title="Explore Qualifications">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: 13 }}>
          Discover qualifications and see what requirements they have
        </Typography>

        <TextField
          size="small"
          placeholder="Search qualifications..."
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
            htmlInput: { 'aria-label': 'Search qualifications' },
          }}
          sx={{ maxWidth: 480, bgcolor: 'action.hover' }}
        />

        <Box
          sx={{
            border: `1px solid ${alpha(tones.info.main, 0.3)}`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <ExpandableTable
            ariaLabel="Explore qualifications"
            rows={pageRows}
            columns={columns}
            getRowId={(q) => String(q.qualificationId)}
            sort={sort}
            onSortChange={(next) => {
              setSort(next)
              setPage(0)
            }}
            renderExpanded={(q) => (
              <CompetenceList
                competences={q.requiredCompetencies}
                onCompetenceClick={(competence) => {
                  onCompetenceClick(competence, q)
                }}
              />
            )}
            emptyMessage="No qualifications found."
          />
        </Box>

        <TablePagination
          component="div"
          count={visible.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[4, 8, 12]}
          labelRowsPerPage="Rows per page"
          labelDisplayedRows={({ from, to, count }) =>
            `Showing ${String(from)}-${String(to)} of ${String(count)}`
          }
          onPageChange={(_event, newPage) => {
            setPage(newPage)
          }}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
        />
      </Box>
    </Panel>
  )
}
