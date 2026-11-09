import { Box, Typography } from '@mui/material'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

import ExpandableTable, { type ExpandableTableColumn } from '../ExpandableTable'
import RenewalChip from '../RenewalChip'
import StatusChip from '../StatusChip'
import {
  competenceTypeLabels,
  statusDisplay,
} from '../../config/qualifications'
import { type Competence } from '../../types/qualifications'
import { formatDate } from '../../utils/formatDate'
import { tones } from '../../config/tones'

const columns: ExpandableTableColumn<Competence>[] = [
  {
    id: 'name',
    label: 'Required competences',
    width: '40%',
    render: (competence) => (
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
          {competence.name}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {competenceTypeLabels[competence.type]}
        </Typography>
      </Box>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    width: '20%',
    render: (competence) => (
      <StatusChip
        label={statusDisplay[competence.status].label}
        tone={statusDisplay[competence.status].tone}
      />
    ),
  },
  {
    id: 'renewal',
    label: 'Renewals',
    width: '20%',
    render: (competence) => (
      <RenewalChip plan={competence.plannedRenewal ?? null} />
    ),
  },
  {
    id: 'validUntil',
    label: 'Valid until',
    width: '15%',
    render: (competence) => (
      <Typography
        sx={{
          fontSize: 13,
          color:
            competence.status === 'expired' ? tones.danger.main : 'inherit',
          fontWeight: competence.status === 'expired' ? 700 : 400,
        }}
      >
        {formatDate(competence.validUntil)}
      </Typography>
    ),
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
  competences: readonly Competence[]
  onCompetenceClick: (competence: Competence) => void
}

// Competences of one qualification, shown under an expanded row.
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
        getRowId={(competence) => competence.id}
        onRowClick={onCompetenceClick}
      />
    </Box>
  )
}
