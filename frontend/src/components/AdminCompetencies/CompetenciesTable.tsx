import { Box, IconButton, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'

import DataTable, { type DataTableColumn } from '../DataTable'

export interface Competency {
  id: number
  competency: string
  type: string
  validity: number
  update: string
}

interface CompetenciesTableProps {
  items: Competency[]
  onItemClick?: (item: Competency) => void
  onDelete?: (item: Competency) => void
}

function CompetenciesTable({
  items,
  onItemClick,
  onDelete,
}: CompetenciesTableProps) {
  const columns: DataTableColumn<Competency>[] = [
    {
      id: 'competency',
      label: 'Competency',
      minWidth: 260,
      render: (item) => (
        <Typography
          component="span"
          sx={{
            fontWeight: 700,
          }}
        >
          {item.competency}
        </Typography>
      ),
    },
    {
      id: 'Type',
      label: 'Type',
      minWidth: 120,
      render: (item) => (
        <Typography component="span" sx={{ fontWeight: 600 }}>
          {item.type}
        </Typography>
      ),
    },
    {
      id: 'validity',
      label: 'Validity',
      minWidth: 120,
      render: (item) => (
        <Typography component="span" sx={{ fontWeight: 600 }}>
          {item.validity} years
        </Typography>
      ),
    },
    {
      id: 'update',
      label: 'Update',
      minWidth: 120,
      render: (item) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            {item.update}
          </Typography>
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation()
              onDelete?.(item)
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={items}
      getRowId={(item) => item.id}
      highlightColumnHeaders
      onRowClick={onItemClick}
    />
  )
}

export default CompetenciesTable
