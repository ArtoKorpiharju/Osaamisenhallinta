import { Box, Typography } from '@mui/material'

import ActionCard from '../ActionCard'
import Panel from '../Panel'
import { type ActionRequiredItem } from '../../types/overview'

interface ActionRequiredProps {
  items: readonly ActionRequiredItem[]
  onAction?: (item: ActionRequiredItem, actionId: string) => void
}

export default function ActionRequired({ items, onAction }: ActionRequiredProps) {
  return (
    <Panel title="Action required">
      {items.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          Nothing needs your attention right now.
        </Typography>
      ) : (
        <Box
          sx={{
            height: 400,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.75,
            pr: 1,
          }}
        >
          {items.map((item) => (
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
