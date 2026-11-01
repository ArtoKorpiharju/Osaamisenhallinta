import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import ActionCard from '../ActionCard'
import Panel from '../Panel'
import { type ActionRequiredItem } from '../../types/overview'

interface ActionRequiredProps {
  items: readonly ActionRequiredItem[]
  onAction?: (item: ActionRequiredItem, actionId: string) => void
}

const statusOrder: Record<string, number> = {
  danger: 0,
  warning: 1,
}

export default function ActionRequired({ items, onAction }: ActionRequiredProps) {
  const { t } = useTranslation()

  const translatedItems = items.map((item) => ({
  ...item,
  status: {
    ...item.status,
    label:
      item.status.tone === 'danger'
        ? t('employeeOverview.actionRequired.statuses.expired')
        : t('employeeOverview.actionRequired.statuses.expiringSoon'),
  },
  actions: item.actions.map((action) => ({
    ...action,
    label:
      action.id === 'plan-renewal'
        ? t('employeeOverview.actionRequired.actions.planRenewal')
        : action.id === 'upload-certificate'
          ? t(
              'employeeOverview.actionRequired.actions.uploadRenewalCertificate',
            )
          : action.label,
  })),
  note:
    item.note === undefined
      ? undefined
      : {
          ...item.note,
          text: t('employeeOverview.actionRequired.noRenewalPlanned'),
        },
}))

  const sortedItems = [...translatedItems].sort(
    (a,b) => statusOrder[a.status.tone] - statusOrder[b.status.tone],
  )
  return (
    <Panel title={t('employeeOverview.actionRequired.title')}>
      {items.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          {t('employeeOverview.actionRequired.empty')}
        </Typography>
      ) : (
        <Box
          sx={{
            height: 420,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.75,
            pr: 1,
          }}
        >
          {sortedItems.map((item) => (
            <ActionCard
              key={item.id}
              title={item.title}
              date={item.dueDate}
              status={item.status}
              actions={item.actions}
              note={item.note}
              onAction={(actionId) => {
                onAction?.(item, actionId)
              }}
            />
          ))}
        </Box>
      )}
    </Panel>
  )
}
