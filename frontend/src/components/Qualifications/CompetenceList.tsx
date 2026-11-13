import { Box, Typography } from '@mui/material'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

import ExpandableTable, { type ExpandableTableColumn } from '../ExpandableTable'
import RenewalChip from '../RenewalChip'
import StatusChip from '../StatusChip'
import {
  competenceTypeLabels,
  competencyStatusDisplay,
} from '../../config/qualifications'
import { tones } from '../../config/tones'
import { type EmployeeCompetency } from '../../types/overview'
import { formatDate } from '../../utils/formatDate'

const columns: ExpandableTableColumn<EmployeeCompetency>[] = [
  {
    id: 'name',
    label: 'Required competences',
    width: '40%',
    render: (competency) => (
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
          {competency.name}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {competenceTypeLabels[competency.type]}
        </Typography>
      </Box>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    width: '20%',
    render: (competency) => (
      <StatusChip
        label={competencyStatusDisplay[competency.status].label}
        tone={competencyStatusDisplay[competency.status].tone}
      />
    ),
  },
  {
    id: 'renewal',
    label: 'Renewals',
    width: '20%',
    render: (competency) => <RenewalChip plan={competency.renewalPlan} />,
  },
  {
    id: 'validUntil',
    label: 'Valid until',
    width: '15%',
    render: (competency) => {
      const isInvalid =
        competency.status === 'expired' || competency.status === 'missing'
      return (
        <Typography
          sx={{
            fontSize: 13,
            color: isInvalid ? tones.danger.main : 'inherit',
            fontWeight: isInvalid ? 700 : 400,
          }}
        >
          {competency.expirationDate
            ? formatDate(competency.expirationDate)
            : '-'}
        </Typography>
      )
    },
  },
  {
    id: 'open',
    label: '',
    width: '5%',
    align: 'right',
    // The whole row is clickable and focusable, the icon only hints at it.
    render: () => <MoreHorizIcon fontSize="small" aria-hidden />,
  },
]

interface CompetenceListProps {
  competences: readonly EmployeeCompetency[]
  onCompetenceClick: (competence: EmployeeCompetency) => void
}

// Competencies of one qualification, shown under an expanded row.
export default function CompetenceList({
  competences,
  onCompetenceClick,
}: CompetenceListProps) {
  return (
    <Box
      sx={{
        mx: 2,
        my: 1.5,
        p: 2,
        border: '2px solid #cbd5df',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        boxSizing: 'border-box',
      }}
    >
      <ExpandableTable
        ariaLabel="Required competences"
        rows={competences}
        columns={columns}
        getRowId={(competency) => String(competency.competencyId)}
        onRowClick={onCompetenceClick}
      />
    </Box>
  )
}
