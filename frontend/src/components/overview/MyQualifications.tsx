import { Box, Button } from '@mui/material'

import StarIcon from '@mui/icons-material/Star'

import GenericTable, { type DataTableColumn } from '../GenericTable'
import Panel from '../Panel'
import StatusChip from '../StatusChip'
import { type Tone, tones } from '../../config/tones'
import { type Qualification, type QualificationStatus } from '../../types/overview'
import { formatDate } from '../../utils/formatDate'

interface MyQualificationsProps {
  qualifications: readonly Qualification[]
  onViewAll?: () => void
  onQualificationClick?: (qualification: Qualification) => void
}

const statusDisplay: Record<QualificationStatus, { label: string; tone: Tone }> =
  {
    expired: { label: 'Expired', tone: 'danger' },
    requirements_incomplete: { label: 'Requirements incomplete', tone: 'warning' },
    qualified: { label: 'Qualified', tone: 'success' },
  }

const columns: DataTableColumn<Qualification>[] = [
  {
    id: 'name',
    label: 'Qualification',
    minWidth: 200,
    render: (qualification) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          width: '100%',
          fontWeight: 400,
        }}
      >
        {qualification.name}
        {qualification.isPrimary === true && (
          <StarIcon
            fontSize="small"
            titleAccess="Primary qualification"
            sx={{ flexShrink: 0, color: tones.star.main, stroke: 'black', strokeWidth: 0.5, }}
          />
        )}
      </Box>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    render: (qualification) => (
      <StatusChip
        label={statusDisplay[qualification.status].label}
        tone={statusDisplay[qualification.status].tone}
      />
    ),
  },
  {
    id: 'requirements',
    label: 'Requirements',
    align: 'center',
    minWidth: 140,
    render: (qualification) =>
      `${qualification.requirementsMet}/${qualification.requirementsTotal}`,
  },
  {
    id: 'validUntil',
    label: 'Valid until',
    align: 'right',
    minWidth: 110,
    render: (qualification) => formatDate(qualification.validUntil),
  },
]

export default function MyQualifications({
  qualifications,
  onViewAll,
  onQualificationClick,
}: MyQualificationsProps) {
  return (
    <Panel
      title="My Qualifications"
      headerAction={
        onViewAll && (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={onViewAll}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            View All
          </Button>
        )
      }
    >
      <GenericTable
        columns={columns}
        rows={[...qualifications]}
        getRowId={(qualification) => qualification.id}
        onRowClick={onQualificationClick}
      />
    </Panel>
  )
}
