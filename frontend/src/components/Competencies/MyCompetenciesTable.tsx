
import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'

import ExpandableTable, {
  type ExpandableTableColumn,
} from '../ExpandableTable'
import Panel from '../Panel'
import { tones } from '../../config/tones'

interface CompetencyRow {
  id: string
}

export default function MyCompetenciesTable() {
  const columns: ExpandableTableColumn<CompetencyRow>[] = [
    {
      id: 'name',
      label: 'My Competencies',
      width: '38%',
      render: () => null,
    },
    {
      id: 'status',
      label: 'Status',
      width: '17%',
      render: () => null,
    },
    {
      id: 'requirements',
      label: 'Requirements met',
      align: 'center',
      width: '17%',
      render: () => null,
    },
    {
      id: 'validUntil',
      label: 'Valid until',
      align: 'right',
      width: '15%',
      render: () => null,
    },
    {
      id: 'remove',
      label: '',
      align: 'center',
      width: '13%',
      render: () => null,
    },
  ]

  return (
    <Panel title="My Competencies">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box
          sx={{
            border: `1px solid ${alpha(tones.info.main, 0.3)}`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <ExpandableTable
            ariaLabel="My Competencies"
            rows={[]}
            columns={columns}
            getRowId={(row) => row.id}
            emptyMessage="You have no competencies yet."
          />
        </Box>
      </Box>
    </Panel>
  )
}