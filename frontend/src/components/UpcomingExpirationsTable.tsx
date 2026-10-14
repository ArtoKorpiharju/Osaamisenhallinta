import { Chip, Typography } from '@mui/material'
import DataTable, { type DataTableColumn } from './DataTable'

export interface ExpirationItem {
  id: number
  employee: string
  competency: string
  expires: string
  urgencyDays: number
  renewalPlan: string | null
}

const getUrgencyStyles = (days: number) => {
  if (days <= 30) {
    return {
      backgroundColor: '#ef6262',
      color: '#ffffff',
    }
  }

  if (days <= 60) {
    return {
      backgroundColor: '#efbb84',
      color: '#1f1f1f',
    }
  }

  return {
    backgroundColor: '#d5dbe1',
    color: '#5f6368',
  }
}

//Day reminder color coded//
const columns: DataTableColumn<ExpirationItem>[] = [
  {
    id: 'employee',
    label: 'Employee',
    minWidth: 180,
    render: (item) => (
      <Typography
        component="span"
        sx={{
          color: '#00509e',
          fontWeight: 700,
        }}
      >
        {item.employee}
      </Typography>
    ),
  },
  {
    id: 'competency',
    label: 'Competency',
    minWidth: 300,
    render: (item) => (
      <Typography
        component="span"
        sx={{
          fontWeight: 600,
        }}
      >
        {item.competency}
      </Typography>
    ),
  },
  {
    id: 'expires',
    label: 'Expires',
    minWidth: 130,
    render: (item) => item.expires,
  },
  {
    id: 'urgency',
    label: 'Urgency',
    minWidth: 110,
    render: (item) => (
      <Chip
        label={String(item.urgencyDays) + 'd'}
        size="small"
        sx={{
          ...getUrgencyStyles(item.urgencyDays),
          fontWeight: 700,
        }}
      />
    ),
  },
  {
    id: 'renewalPlan',
    label: 'Renewal plan',
    minWidth: 140,
    render: (item) =>
      item.renewalPlan ?? (
        <Chip
          label="Not planned"
          size="small"
          sx={{
            backgroundColor: '#ffd6d6',
            color: '#e53935',
          }}
        />
      ),
  },
]

interface UpcomingExpirationsTableProps {
  items: ExpirationItem[]
  onItemClick?: (item: ExpirationItem) => void
}

function UpcomingExpirationsTable({
  items,
  onItemClick,
}: UpcomingExpirationsTableProps) {
  return (
    <DataTable
      title="Upcoming Expirations"
      columns={columns}
      rows={items}
      getRowId={(item) => item.id}
      onRowClick={onItemClick}
    />
  )
}

export default UpcomingExpirationsTable