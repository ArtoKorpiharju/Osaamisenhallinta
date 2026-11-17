import { Box, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

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
import { type EmployeeCompetency } from '../../types/overview'
import { type QualificationDetails } from '../../types/qualifications'
import { compareQualifications } from '../../utils/qualifications'
import { formatDate } from '../../utils/formatDate'
import CompetenceList from './CompetenceList'

interface MyQualificationsTableProps {
  qualifications: readonly QualificationDetails[]
  onCompetenceClick: (
    competence: EmployeeCompetency,
    qualification: QualificationDetails
  ) => void
  onRemove: (qualification: QualificationDetails) => void
  onToggleFavorite?: (qualification: QualificationDetails) => void
  expandedQualificationId?: number
}

export default function MyQualificationsTable({
  qualifications,
  onCompetenceClick,
  onRemove,
  onToggleFavorite,
  expandedQualificationId,
}: MyQualificationsTableProps) {
  const { t } = useTranslation()

  const columns: ExpandableTableColumn<QualificationDetails>[] = [
    {
      id: 'name',
      label: t('qualifications.columns.myQualifications'),
      width: '38%',
      sortValue: (q) => q.name,
      render: (q, { expanded }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flexShrink: 0, width: 88 }}>
            {q.isCritical && <CriticalBadge />}
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
              active={q.isFavourite}
              label={
                q.isFavourite
                  ? t('qualifications.my.removeFromOverview', { name: q.name })
                  : t('qualifications.my.addNamedToOverview', { name: q.name })
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
      label: t('qualifications.columns.status'),
      width: '17%',
      sortValue: (q) => statusOrder[q.status],
      render: (q) => (
        <StatusChip
          label={t(statusDisplay[q.status].labelKey)}
          tone={statusDisplay[q.status].tone}
        />
      ),
    },
    {
      id: 'requirements',
      label: t('qualifications.columns.requirementsMet'),
      align: 'center',
      width: '17%',
      render: (q) =>
        `${String(q.requirementsMet)}/${String(q.requirementsTotal)}`,
    },
    {
      id: 'validUntil',
      label: t('qualifications.columns.validUntil'),
      align: 'right',
      width: '15%',
      sortValue: (q) => q.validUntil,
      render: (q) => (
        <Box
          component="span"
          sx={{
            color:
              q.status === 'notQualified' || q.status === 'expired'
                ? tones.danger.main
                : undefined,
          }}
        >
          {q.validUntil ? formatDate(q.validUntil) : '-'}
        </Box>
      ),
    },
    {
      id: 'remove',
      label: '',
      align: 'center',
      width: '13%',
      render: (q) => {
        const isCritical = q.isCritical
        return (
          <IconButton
            size="small"
            disabled={isCritical}
            aria-label={
              isCritical
                ? t('qualifications.my.criticalCannotRemove', { name: q.name })
                : t('qualifications.my.remove', { name: q.name })
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
    <Panel title={t('qualifications.my.title')}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <QualificationLegend
          favoriteLabel={t('qualifications.my.addToOverview')}
        />
        {/* Frame around the whole table. */}
        <Box
          sx={{
            border: `1px solid ${alpha(tones.info.main, 0.3)}`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <ExpandableTable
            ariaLabel={t('qualifications.my.tableLabel')}
            rows={[...qualifications].sort(compareQualifications)}
            columns={columns}
            getRowId={(q) => String(q.qualificationId)}
            defaultExpandedIds={
              expandedQualificationId === undefined
                ? undefined
                : [String(expandedQualificationId)]
            }
            renderExpanded={(q) => (
              <CompetenceList
                competences={q.requiredCompetencies}
                onCompetenceClick={(competence) => {
                  onCompetenceClick(competence, q)
                }}
              />
            )}
            emptyMessage={t('qualifications.my.empty')}
          />
        </Box>
      </Box>
    </Panel>
  )
}
