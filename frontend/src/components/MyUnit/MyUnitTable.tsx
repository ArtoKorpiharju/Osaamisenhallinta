import { useMemo, useState } from 'react'
import {
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

import DataTable, { type DataTableColumn } from '../DataTable'
import { tones } from '../../config/tones'

export interface MyUnitItem {
  id: number
  employee: string
  criticalQualifications: number
  qualifications: number
  competencies: number
  plannedRenewals: number
  searchTerms: string[]
}

interface MyUnitTableProps {
  items: MyUnitItem[]
  onEmployeeClick?: (item: MyUnitItem) => void
}

// Render a column cell
function renderCount(count: number) {
  return (
    <Typography component="span" sx={{ fontWeight: 700 }}>
      {count}
    </Typography>
  )
}

// Filter to the items with search term in it
function filterMyUnitItems(items: MyUnitItem[], search: string): MyUnitItem[] {
  const query = search.trim().toLowerCase()
  if (query === '') return items

  return items.filter((item) =>
    [item.employee, ...item.searchTerms].some((term) =>
      term.toLowerCase().includes(query)
    )
  )
}

function MyUnitTable({ items, onEmployeeClick }: MyUnitTableProps) {
  const { t } = useTranslation()

  const [search, setSearch] = useState('')

  const visible = useMemo(
    () => filterMyUnitItems(items, search),
    [items, search]
  )

  const columns: DataTableColumn<MyUnitItem>[] = [
    {
      id: 'employee',
      label: t('myUnit.employees.columns.employee'),
      minWidth: 200,
      render: (item) => (
        <Link
          component="button"
          variant="body1"
          underline="hover"
          onClick={() => {
            onEmployeeClick?.(item)
          }}
          sx={{
            color: tones.info.main,
            fontWeight: 700,
          }}
        >
          {item.employee}
        </Link>
      ),
    },
    {
      id: 'criticalQualifications',
      label: t('myUnit.employees.columns.criticalQualifications'),
      align: 'center',
      minWidth: 130,
      render: (item) => renderCount(item.criticalQualifications),
    },
    {
      id: 'qualifications',
      label: t('myUnit.employees.columns.qualifications'),
      align: 'center',
      minWidth: 130,
      render: (item) => renderCount(item.qualifications),
    },
    {
      id: 'competencies',
      label: t('myUnit.employees.columns.competencies'),
      align: 'center',
      minWidth: 130,
      render: (item) => renderCount(item.competencies),
    },
    {
      id: 'plannedRenewals',
      label: t('myUnit.employees.columns.plannedRenewals'),
      align: 'center',
      minWidth: 130,
      render: (item) => renderCount(item.plannedRenewals),
    },
  ]

  return (
    <Paper
      variant="outlined"
      square
      sx={{ minWidth: 0, p: 2, borderColor: '#d8e6f3' }}
    >
      <Stack spacing={2}>
        <TextField
          size="small"
          placeholder={t('myUnit.employees.searchPlaceholder')}
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
            htmlInput: {
              'aria-label': t('myUnit.employees.searchLabel'),
            },
          }}
          sx={{ maxWidth: 480, bgcolor: 'action.hover' }}
        />

        <DataTable
          columns={columns}
          rows={visible}
          getRowId={(item) => item.id}
        />
      </Stack>
    </Paper>
  )
}

export default MyUnitTable
