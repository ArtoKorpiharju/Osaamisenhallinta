import { Box, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'

import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'

import CriticalBadge from '../CriticalBadge'
import ExpandableTable, { type ExpandableTableColumn } from '../ExpandableTable'
import FavoriteStar from '../FavoriteStar'
import Panel from '../Panel'
import QualificationLegend from '../QualificationLegend'
import StatusChip from '../StatusChip'
import { statusDisplay, statusOrder } from '../../config/qualifications'
import { tones } from '../../config/tones'
import {
  type Competence,
  type QualificationDetails,
} from '../../types/qualifications'
import { compareQualifications } from '../../utils/qualifications'
import { formatDate } from '../../utils/formatDate'
import CompetenceList from './CompetenceList'

interface MyQualificationsTableProps {
  qualifications: readonly QualificationDetails[]
  onCompetenceClick: (
    competence: Competence,
    qualification: QualificationDetails
  ) => void
  onRemove: (qualification: QualificationDetails) => void
  onToggleFavorite?: (qualification: QualificationDetails) => void
}

export default function MyQualificationsTable({
  qualifications,
  onCompetenceClick,
  onRemove,
  onToggleFavorite,
}: MyQualificationsTableProps) {
  const columns: ExpandableTableColumn<QualificationDetails>[] = [
    {
      id: 'name',
      label: 'My Qualifications',
      width: '38%',
      sortValue: (q) => q.name,
      render: (q, { expanded }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flexShrink: 0, width: 88 }}>
            {q.isCritical === true && <CriticalBadge />}
          </Box>
          {q.name}
          <ArrowRightIcon
            fontSize="small"
            aria-hidden
            sx={{
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
          {onToggleFavorite && (
            <FavoriteStar
              active={q.isPrimary === true}
              label={
                q.isPrimary === true
                  ? `Remove ${q.name} from Overview`
                  : `Add ${q.name} to Overview`
              }
              onToggle={() => {
                onToggleFavorite(q)
              }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      width: '17%',
      sortValue: (q) => statusOrder[q.status],
      render: (q) => (
        <StatusChip
          label={statusDisplay[q.status].label}
          tone={statusDisplay[q.status].tone}
        />
      ),
    },
    {
      id: 'requirements',
      label: 'Requirements met',
      align: 'center',
      width: '17%',
      render: (q) => `${q.requirementsMet}/${q.requirementsTotal}`,
    },
    {
      id: 'validUntil',
      label: 'Valid until',
      align: 'right',
      width: '15%',
      sortValue: (q) => q.validUntil,
      render: (q) => (
        <Box
          component="span"
          sx={{ color: q.status === 'expired' ? tones.danger.main : undefined }}
        >
          {formatDate(q.validUntil)}
        </Box>
      ),
    },
    {
      id: 'remove',
      label: '',
      align: 'center',
      width: '13%',
      render: (q) => {
        const isCritical = q.isCritical === true
        return (
          <IconButton
            size="small"
            disabled={isCritical}
            aria-label={
              isCritical
                ? `${q.name} is critical and cannot be removed`
                : `Remove ${q.name}`
            }
            onClick={(event) => {
              // Do not expand the row.
              event.stopPropagation()
              onRemove(q)
            }}
            sx={{
              color: 'text.secondary',
              '&.Mui-disabled': { color: 'action.disabled' },
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )
      },
    },
  ]

  return (
    <Panel title="My Qualifications">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <QualificationLegend favoriteLabel="Add to Overview" />
        {/* Frame around the whole table. */}
        <Box
          sx={{
            border: `1px solid ${alpha(tones.info.main, 0.3)}`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <ExpandableTable
            ariaLabel="My qualifications"
            rows={[...qualifications].sort(compareQualifications)}
            columns={columns}
            getRowId={(q) => q.id}
            renderExpanded={(q) => (
              <CompetenceList
                competences={q.competences}
                onCompetenceClick={(competence) => {
                  onCompetenceClick(competence, q)
                }}
              />
            )}
            emptyMessage="You have no qualifications yet."
          />
        </Box>
      </Box>
    </Panel>
  )
}
