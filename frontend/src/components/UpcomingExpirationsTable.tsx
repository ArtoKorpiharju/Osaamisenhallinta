import { Chip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import DataTable, { type DataTableColumn } from './DataTable'
import { tones } from '../config/tones'

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

interface UpcomingExpirationsTableProps {
  items: ExpirationItem[]
  onItemClick?: (item: ExpirationItem) => void
}

function UpcomingExpirationsTable({
  items,
  onItemClick,
}: UpcomingExpirationsTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn<ExpirationItem>[] = [
    {
      id: 'employee',
      label: t('supervisorOverview.expirations.columns.employee'),
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
      label: t('supervisorOverview.expirations.columns.competency'),
      minWidth: 300,
      render: (item) => (
        <Typography component="span" sx={{ fontWeight: 600 }}>
          {item.competency}
        </Typography>
      ),
    },
    {
      id: 'expires',
      label: t('supervisorOverview.expirations.columns.expires'),
      minWidth: 130,
      render: (item) => (
        <Typography component="span" sx={{ fontWeight: 600 }}>
          {item.expires}
        </Typography>
      ),
    },
    {
      id: 'urgency',
      label: t('supervisorOverview.expirations.columns.urgency'),
      minWidth: 110,
      render: (item) => (
        <Chip
          label={`${String(item.urgencyDays)}${t(
            'supervisorOverview.expirations.dayAbbreviation',
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
      label: t('supervisorOverview.expirations.columns.renewalPlan'),
      minWidth: 140,
      render: (item) =>
        item.renewalPlan === null ? (
          <Chip
            label={t('supervisorOverview.expirations.notPlanned')}
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
      title={t('supervisorOverview.expirations.title')}
      columns={columns}
      rows={items}
      getRowId={(item) => item.id}
      onRowClick={onItemClick}
    />
  )
}

export default UpcomingExpirationsTable