
import { Box, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { useTranslation } from 'react-i18next'

import ExpandableTable, {type ExpandableTableColumn,} from '../ExpandableTable'
import { tones } from '../../config/tones'

import {
  competencyStatusDisplay,
  competencyStatusOrder,
} from '../../config/competency'
import { type EmployeeCompetency } from '../../types/overview'
import { formatDate } from '../../utils/formatDate'
import StatusChip from '../StatusChip'

interface MyCompetenciesTableProps {
  competencies: readonly EmployeeCompetency[]
  onRemove?: (competency: EmployeeCompetency) => void
  onCompetencyClick?: (competency: EmployeeCompetency) => void
}

export default function MyCompetenciesTable({
  competencies,
  onRemove,
  onCompetencyClick,
}: MyCompetenciesTableProps) {
  const { t } = useTranslation()

  const columns: ExpandableTableColumn<EmployeeCompetency>[] = [
    {
      id: 'name',
      label: t('competencies.table.columns.name'),
      width: '38%',
      sortValue: (c) => c.name,
      render: (c) => c.name,
    },
    {
      id: 'type',
      label: t('competencies.table.columns.type'),
      width: '17%',
      sortValue: (c) => t(`competencies.types.${c.type}`),
      render: (c) => t(`competencies.types.${c.type}`),
    },
    {
      id: 'status',
      label: t('competencies.table.columns.status'),
      width: '17%',
      sortValue: (c) => competencyStatusOrder[c.status],
      render: (c) => (
        <StatusChip
          label={t(`competencies.statuses.${c.status}`)}
          tone={competencyStatusDisplay[c.status].tone}
        />
      ),
    },
    {
      id: 'renewals',
      label: t('competencies.table.columns.renewals'),
      align: 'center',
      width: '17%',
      sortValue: (c) => c.renewalPlan?.renewalDate,
      render: (c) =>
        c.renewalPlan ? formatDate(c.renewalPlan.renewalDate) : '-',
    },
    {
      id: 'validUntil',
      label: t('competencies.table.columns.validUntil'),
      align: 'right',
      width: '18%',
      sortValue: (c) => c.expirationDate,
      render: (c) => (
        <Box
          component="span"
          sx={{
            color:
              c.status === 'expired' || c.status === 'missing'
                ? tones.danger.main
                : undefined,
          }}
        >
          {c.expirationDate ? formatDate(c.expirationDate) : '-'}
        </Box>
      ),
    },
    {
      id: 'remove',
      label: '',
      align: 'center',
      width: '13%',
      render: (c) => (
        <IconButton
          size="small"
          disabled={c.employeeCompetencyId === null}
          aria-label={t('competencies.table.removeAriaLabel', {
            name: c.name,
          })}
          onClick={(event) => {
            // Do not trigger row click.
            event.stopPropagation()
            onRemove?.(c)
          }}
          sx={{
            color: 'text.secondary',
            '&.Mui-disabled': { color: 'action.disabled' },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Frame around the whole table. */}
      <Box
        sx={{
          border: `1px solid ${alpha(tones.info.main, 0.3)}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <ExpandableTable
          ariaLabel={t('competencies.table.ariaLabel')}
          rows={[...competencies].sort(
            (a, b) =>
              competencyStatusOrder[a.status] - competencyStatusOrder[b.status]
          )}
          columns={columns}
          getRowId={(c) =>
            String(c.employeeCompetencyId ?? `missing-${String(c.competencyId)}`)
          }
          onRowClick={onCompetencyClick}
          emptyMessage={t('competencies.table.empty')}
        />
      </Box>
    </Box>
  )
}