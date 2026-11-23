import { Chip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import DataTable, { type DataTableColumn } from './DataTable'
import { tones } from '../config/tones'

export interface ExpirationItem {
  id: number
  employee: string
  competency: string
  expires: string | null
  urgencyDays: number
  renewalPlan: string | null
}

const getUrgencyStyles = (days: number) => {
  if (days <= 30) {
    return {
      backgroundColor: tones.danger.background,
      color: tones.danger.text,
    }
  }

  if (days <= 60) {
    return {
      backgroundColor: tones.warning.background,
      color: tones.warning.text,
    }
  }

  return {
    backgroundColor: tones.info.background,
    color: tones.info.text,
  }
}

interface InvalidAndExpiringCompetenciesTableProps {
  items: ExpirationItem[]
  onItemClick?: (item: ExpirationItem) => void
}

function InvalidAndExpiringCompetenciesTable({
  items,
  onItemClick,
}: InvalidAndExpiringCompetenciesTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn<ExpirationItem>[] = [
    {
      id: 'employee',
      label: t('supervisorOverview.invalidAndExpiring.columns.employee'),
      minWidth: 180,
      render: (item) => (
        <Typography
          component="span"
          sx={{
            color: tones.info.main,
            fontWeight: 700,
          }}
        >
          {item.employee}
        </Typography>
      ),
    },
    {
      id: 'competency',
      label: t('supervisorOverview.invalidAndExpiring.columns.competency'),
      minWidth: 300,
      render: (item) => (
        <Typography component="span" sx={{ fontWeight: 600 }}>
          {item.competency}
        </Typography>
      ),
    },
    {
      id: 'expires',
      label: t('supervisorOverview.invalidAndExpiring.columns.expires'),
      minWidth: 140,
      render: (item) =>
        item.expires !== null ? (
          <Typography component="span" sx={{ fontWeight: 600 }}>
            {item.expires}
          </Typography>
        ) : (
          <Typography component="span" sx={{ fontWeight: 600 }}>
            {t('supervisorOverview.invalidAndExpiring.notCompleted')}
          </Typography>
        ),
    },
    {
      id: 'urgency',
      label: t('supervisorOverview.invalidAndExpiring.columns.urgency'),
      minWidth: 110,
      render: (item) => (
        <Chip
          label={`${String(item.urgencyDays)}${t(
            'supervisorOverview.invalidAndExpiring.dayAbbreviation'
          )}`}
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
      label: t('supervisorOverview.invalidAndExpiring.columns.renewalPlan'),
      minWidth: 140,
      render: (item) =>
        item.renewalPlan === null ? (
          <Chip
            label={t('supervisorOverview.invalidAndExpiring.notPlanned')}
            size="small"
            sx={{
              backgroundColor: tones.danger.background,
              color: tones.danger.text,
            }}
          />
        ) : (
          <Typography component="span" sx={{ fontWeight: 600 }}>
            {item.renewalPlan}
          </Typography>
        ),
    },
  ]

  return (
    <DataTable
      title={t('supervisorOverview.invalidAndExpiring.title')}
      columns={columns}
      rows={items}
      getRowId={(item) => item.id}
      onRowClick={onItemClick}
    />
  )
}

export default InvalidAndExpiringCompetenciesTable
