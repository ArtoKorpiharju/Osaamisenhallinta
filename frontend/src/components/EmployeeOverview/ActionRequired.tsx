import { Box, Typography } from '@mui/material'

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
  const sortedItems = [...items].sort(
    (a,b) => statusOrder[a.status.tone] - statusOrder[b.status.tone],
  )
  return (
    <Panel title="Action required">
      {items.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          Nothing needs your attention right now.
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
