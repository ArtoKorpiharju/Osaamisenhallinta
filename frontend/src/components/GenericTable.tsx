import type { ReactNode } from 'react'
import { Paper, Typography } from '@mui/material'
import {
  DataGrid,
  type GridColDef,
  type GridValidRowModel,
} from '@mui/x-data-grid'

export type DataTableColumn<T extends GridValidRowModel> = {
  id: string
  label: string
  align?: 'left' | 'center' | 'right'
  minWidth?: number
  render: (row: T) => ReactNode
}

type DataTableProps<T extends GridValidRowModel> = {
  title?: string
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string | number
  onRowClick?: (row: T) => void
}

function DataTable<T extends GridValidRowModel>({
  title,
  columns,
  rows,
  getRowId,
  onRowClick,
}: DataTableProps<T>) {
  const gridColumns: GridColDef[] = columns.map((column) => ({
    field: column.id,
    headerName: column.label,
    minWidth: column.minWidth,
    flex: 1,
    align: column.align ?? 'left',
    headerAlign: column.align ?? 'left',
    renderCell: (params) => column.render(params.row as T),
  }))

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {title && (
        <Typography
          component="h2"
          variant="h6"
          sx={{
            backgroundColor: '#e6eef5',
            color: '#5f6368',
            fontWeight: 700,
            paddingX: 3,
            paddingY: 2,
            textAlign: 'left',
          }}
        >
          {title}
        </Typography>
      )}

      <DataGrid
        rows={rows}
        columns={gridColumns}
        getRowId={getRowId}
        hideFooter
        disableRowSelectionOnClick
        rowHeight={52}
        columnHeaderHeight={56}
        onRowClick={
          onRowClick
            ? (params) => {
                onRowClick(params.row)
              }
            : undefined
        }
        sx={{
          border: 0,
          height: 420,
          cursor: onRowClick ? 'pointer' : 'default',
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#dbeafe',
          },
        }}
      />
    </Paper>
  )
}

export default DataTable
