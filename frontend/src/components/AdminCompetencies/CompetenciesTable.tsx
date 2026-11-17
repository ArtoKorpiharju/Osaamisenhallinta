import { Box, IconButton, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useTranslation } from 'react-i18next'

import DataTable, { type DataTableColumn } from '../DataTable'

export interface Competency {
  id: number
  competency: string
  type: string
  validity: number
}

interface CompetenciesTableProps {
  items: Competency[]
  onItemClick?: (item: Competency) => void
  onDelete?: (item: Competency) => void
}

function CompetenciesTable({
  items,
  onItemClick,
  onDelete,
}: CompetenciesTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn<Competency>[] = [
    {
      id: 'competency',
      label: t('adminCompetencies.table.competency'),
      minWidth: 260,
      render: (item) => (
        <Typography
          component="span"
          variant="subtitle2"
          sx={{
            fontWeight: 700,
          }}
        >
          {item.competency}
        </Typography>
      ),
    },
    {
      id: 'Type',
      label: t('adminCompetencies.table.type'),
      minWidth: 120,
      render: (item) => (
        <Typography
          component="span"
          variant="subtitle2"
          sx={{ fontWeight: 600 }}
        >
          {t(`adminCompetencies.types.${item.type.toLowerCase()}`, {
            defaultValue: item.type,
          })}
        </Typography>
      ),
    },
    {
      id: 'validity',
      label: t('adminCompetencies.table.validity'),
      minWidth: 120,
      render: (item) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography
            component="span"
            variant="subtitle2"
            sx={{ fontWeight: 600 }}
          >
            {item.validity} {t('adminCompetencies.table.years')}
          </Typography>
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation()
              onDelete?.(item)
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={items}
      getRowId={(item) => item.id}
      highlightColumnHeaders
      onRowClick={onItemClick}
    />
  )
}

export default CompetenciesTable
