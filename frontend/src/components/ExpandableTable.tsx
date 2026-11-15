import { Fragment, type KeyboardEvent, type ReactNode, useState } from 'react'

import {
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'

export interface ExpandableTableColumn<T> {
  id: string
  label: ReactNode
  align?: 'left' | 'center' | 'right'
  /** Column width, e.g. '20%'. Give every column one so separate tables line up */
  width?: string
  render: (row: T, state: { expanded: boolean }) => ReactNode
  sortValue?: (row: T) => string | number | null | undefined
}

export interface SortState {
  by: string | null
  direction: 'asc' | 'desc'
}

interface ExpandableTableProps<T> {
  rows: readonly T[]
  columns: readonly ExpandableTableColumn<T>[]
  getRowId: (row: T) => string
  /** When given, rows expand on click and this renders the content under the row */
  renderExpanded?: (row: T) => ReactNode
  onRowClick?: (row: T) => void
  hideHeader?: boolean
  emptyMessage?: ReactNode
  ariaLabel?: string
  /** Controlled sorting. When given, the parent sorts `rows` itself */
  sort?: SortState
  onSortChange?: (sort: SortState) => void
}

function sortRows<T>(
  rows: readonly T[],
  columns: readonly ExpandableTableColumn<T>[],
  { by, direction }: SortState
): T[] {
  const column = columns.find((item) => item.id === by)
  if (!column?.sortValue) return [...rows]

  const getValue = column.sortValue

  return [...rows].sort((a, b) => {
    const aValue = getValue(a)
    const bValue = getValue(b)

    // Keep missing values at the end in either sort direction.
    if (aValue == null) return bValue == null ? 0 : 1
    if (bValue == null) return -1

    let result: number

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      result = aValue - bValue
    } else {
      result = String(aValue).localeCompare(String(bValue), 'fi', {
        numeric: true,
        sensitivity: 'base',
      })
    }

    return direction === 'asc' ? result : -result
  })
}

/**
 * Generic table with optional expandable rows.
 * MUI X DataGrid cannot expand rows in its free version (it is a Pro feature),
 * so this is built on the plain MUI Table.
 */
export default function ExpandableTable<T>({
  rows,
  columns,
  getRowId,
  renderExpanded,
  onRowClick,
  hideHeader = false,
  emptyMessage = 'No data',
  ariaLabel,
  sort,
  onSortChange,
}: ExpandableTableProps<T>) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(new Set())
  const [internalSort, setInternalSort] = useState<SortState>({
    by: null,
    direction: 'asc',
  })

  // Sorting is controlled when `sort` is given, otherwise the table sorts itself.
  const { by: sortBy, direction: sortDirection } = sort ?? internalSort

  const interactive = renderExpanded !== undefined || onRowClick !== undefined

  const sortedRows =
    sort === undefined ? sortRows(rows, columns, internalSort) : rows

  const handleSort = (column: ExpandableTableColumn<T>) => {
    if (!column.sortValue) return

    let next: SortState

    if (sortBy !== column.id) {
      next = { by: column.id, direction: 'asc' }
    } else if (sortDirection === 'asc') {
      next = { by: column.id, direction: 'desc' }
    } else if (sort === undefined) {
      // Third click on a self-sorted table: back to the order of `rows`.
      next = { by: null, direction: 'asc' }
    } else {
      next = { by: column.id, direction: 'asc' }
    }

    if (sort === undefined) {
      setInternalSort(next)
    }
    onSortChange?.(next)
  }

  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const activate = (row: T) => {
    if (renderExpanded !== undefined) {
      toggle(getRowId(row))
    }
    onRowClick?.(row)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    // Ignore keys pressed on buttons inside the row (e.g. the favorite star)
    if (event.target !== event.currentTarget) {
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate(row)
    }
  }

  return (
    <Table
      size="small"
      aria-label={ariaLabel}
      sx={{
        tableLayout: 'fixed',
        backgroundColor: '#ffffff',
      }}
    >
      <colgroup>
        {columns.map((column) => (
          <col key={column.id} style={{ width: column.width }} />
        ))}
      </colgroup>

      {!hideHeader && (
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                sortDirection={sortBy === column.id ? sortDirection : false}
                sx={{
                  py: 1.5,
                  bgcolor: '#e4edf5',
                  color: '#174f83',
                  fontSize: 13,
                  fontWeight: 700,
                  borderBottom: '1px solid #e0e3e8',
                  '& .MuiTableSortLabel-root': {
                    color: '#174f83',
                    fontWeight: 700,
                  },
                  '& .MuiTableSortLabel-root:hover': {
                    color: '#174f83',
                  },
                  '& .MuiTableSortLabel-root.Mui-active': {
                    color: '#174f83',
                  },
                }}
              >
                {column.sortValue ? (
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sortDirection : 'asc'}
                    onClick={() => {
                      handleSort(column)
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}

      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              align="center"
              sx={{ py: 3, borderBottom: 'none' }}
            >
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {emptyMessage}
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          sortedRows.map((row) => {
            const id = getRowId(row)
            const expanded = expandedIds.has(id)

            return (
              <Fragment key={id}>
                <TableRow
                  tabIndex={interactive ? 0 : undefined}
                  onClick={
                    interactive
                      ? () => {
                          activate(row)
                        }
                      : undefined
                  }
                  onKeyDown={
                    interactive
                      ? (event) => {
                          handleKeyDown(event, row)
                        }
                      : undefined
                  }
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    '& > .MuiTableCell-root': {
                      borderBottom: '1px solid #d5dee7',
                    },
                    '&:hover': {
                      backgroundColor: '#d6e5f1',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #174f83',
                      outlineOffset: -2,
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        py: 1.25,
                        fontSize: 13,
                        fontWeight: 600,
                        borderBottom: '1px solid #d5dee7',
                      }}
                    >
                      {column.render(row, { expanded })}
                    </TableCell>
                  ))}
                </TableRow>

                {renderExpanded !== undefined && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      sx={{ p: 0, borderBottom: 'none' }}
                    >
                      <Collapse in={expanded} timeout="auto" unmountOnExit>
                        {renderExpanded(row)}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
