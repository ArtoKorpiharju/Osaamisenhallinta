import { Box, Button, Typography } from '@mui/material'

import StarIcon from '@mui/icons-material/Star'

import CriticalBadge from '../CriticalBadge'
import GenericTable, { type DataTableColumn } from '../DataTable'
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
    expired: { label: 'Invalid', tone: 'danger' },
    expiring: { label: 'Expiring soon', tone: 'warning' },
    qualified: { label: 'Qualified', tone: 'success' },
  }

const statusOrder: Record<QualificationStatus, number> = {
  expired: 0,
  expiring: 1,
  qualified: 2,
}

const columns: DataTableColumn<Qualification>[] = [
  {
    id: 'name',
    label: 'Qualification',
    minWidth: 360,
    render: (qualification) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          fontWeight: 600,
        }}
      >
        <Box sx={{ flexShrink: 0, width: 88 }}>
          {qualification.isCritical === true && <CriticalBadge />}
        </Box>
        {qualification.name}
        {qualification.isPrimary === true && (
          <StarIcon
            fontSize="small"
            titleAccess="Primary qualification"
            sx={{ flexShrink: 0, color: tones.star.main, stroke: 'black', strokeWidth: 0.5 }}
          />
        )}
      </Box>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 120,
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
    minWidth: 120,
    render: (qualification) => (
      <Box sx={{ fontWeight: 600 }}>
        {qualification.requirementsMet}/{qualification.requirementsTotal}
      </Box>
    ),
  },
  {
    id: 'validUntil',
    label: 'Valid until',
    align: 'right',
    minWidth: 100,
    render: (qualification) => (
      <Box sx={{ fontWeight: 600 }}>
        {formatDate(qualification.validUntil)}
      </Box>
    ),
  },
]

function Legend() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 24px',
        color: '#174f83',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <StarIcon fontSize="small" sx={{ color: tones.star.main, stroke: 'black', strokeWidth: 0.5 }} />
        <Typography sx={{ fontSize: 13 }}>= My favorite</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <CriticalBadge />
        <Typography sx={{ fontSize: 13 }}>= Employer requirement</Typography>
      </Box>
    </Box>
  )
}

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
            sx={{ textTransform: 'none', color: 'tones.info.main' }}
          >
            View All
          </Button>
        )
      }
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}
      >
        <Legend />
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <GenericTable
            columns={columns}
            rows={[...qualifications].sort(
              (a, b) => statusOrder[a.status] - statusOrder[b.status],
            )}
            getRowId={(qualification) => qualification.id}
            onRowClick={onQualificationClick}
          />
        </Box>
      </Box>
    </Panel>
  )
}
