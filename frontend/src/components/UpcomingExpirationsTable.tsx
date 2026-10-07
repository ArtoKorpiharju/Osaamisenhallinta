import { Chip, Typography } from '@mui/material'
import DataTable, { type DataTableColumn } from './DataTable'

type ExpirationItem = {
  id: number
  employee: string
  competency: string
  expires: string
  urgencyDays: number
  renewalPlan: string | null
}

//Temporary frontend examples//
const expirationItems: ExpirationItem[] = [
  {
    id: 1,
    employee: 'Emma Johnson',
    competency: 'Magnetic Flux Leakage (MFL)',
    expires: '17.10.2026',
    urgencyDays: 14,
    renewalPlan: null,
  },
  {
    id: 2,
    employee: 'Alex Smith',
    competency: 'First Aid Training',
    expires: '26.10.2026',
    urgencyDays: 23,
    renewalPlan: '20.10.2026',
  },
  {
    id: 3,
    employee: 'Mia Wilson',
    competency: 'Safety Card',
    expires: '06.11.2026',
    urgencyDays: 34,
    renewalPlan: null,
  },
  {
    id: 4,
    employee: 'Jessica Wilson',
    competency: 'Forklift Licence',
    expires: '23.11.2026',
    urgencyDays: 51,
    renewalPlan: '11.11.2026',
  },
  {
    id: 5,
    employee: 'Zara Lopez',
    competency: 'Guided Wave Testing (GWT)',
    expires: '28.11.2026',
    urgencyDays: 56,
    renewalPlan: null,
  },
  {
    id: 6,
    employee: 'Ashley Jones',
    competency: 'Leak Testing (LT)',
    expires: '02.12.2026',
    urgencyDays: 60,
    renewalPlan: null,
  },
  {
    id: 7,
    employee: 'Noah Carlsen',
    competency: 'Through Transmission Ultrasound',
    expires: '14.12.2026',
    urgencyDays: 72,
    renewalPlan: null,
  },
]

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
        label={`${item.urgencyDays}d`}
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
      item.renewalPlan ? (
        item.renewalPlan
      ) : (
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

type UpcomingExpirationsTableProps = {
  onItemClick?: (item: ExpirationItem) => void
}

function UpcomingExpirationsTable({
  onItemClick,
}: UpcomingExpirationsTableProps) {
  return (
    <DataTable
      title="Upcoming Expirations"
      columns={columns}
      rows={expirationItems}
      getRowId={(item) => item.id}
      onRowClick={onItemClick}
    />
  )
}

export default UpcomingExpirationsTable