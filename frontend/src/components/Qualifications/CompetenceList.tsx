import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

import ExpandableTable, { type ExpandableTableColumn } from '../ExpandableTable'
import RenewalChip from '../RenewalChip'
import StatusChip from '../StatusChip'
import {
  competenceTypeKeys,
  competencyStatusDisplay,
} from '../../config/qualifications'
import { tones } from '../../config/tones'
import { type EmployeeCompetency } from '../../types/overview'
import { formatDate } from '../../utils/formatDate'

interface CompetenceListProps {
  competences: readonly EmployeeCompetency[]
  onCompetenceClick: (competence: EmployeeCompetency) => void
}

// Competencies of one qualification, shown under an expanded row.
export default function CompetenceList({
  competences,
  onCompetenceClick,
}: CompetenceListProps) {
  const { t } = useTranslation()

  const columns: ExpandableTableColumn<EmployeeCompetency>[] = [
    {
      id: 'name',
      label: t('qualifications.competences.required'),
      width: '40%',
      render: (competency) => (
        <Box>
          <Typography component="p" variant="subtitle2">
            {competency.name}
          </Typography>
          <Typography
            component="p"
            variant="caption"
            sx={{ color: 'text.secondary' }}
          >
            {t(competenceTypeKeys[competency.type])}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: t('qualifications.competences.status'),
      width: '20%',
      render: (competency) => (
        <StatusChip
          label={t(competencyStatusDisplay[competency.status].labelKey)}
          tone={competencyStatusDisplay[competency.status].tone}
        />
      ),
    },
    {
      id: 'renewal',
      label: t('qualifications.competences.renewals'),
      width: '20%',
      render: (competency) => <RenewalChip plan={competency.renewalPlan} />,
    },
    {
      id: 'validUntil',
      label: t('qualifications.competences.validUntil'),
      width: '15%',
      render: (competency) => {
        const isInvalid =
          competency.status === 'expired' || competency.status === 'missing'
        return (
          <Typography
            variant="body2"
            sx={{
              color: isInvalid ? tones.danger.main : 'inherit',
              fontWeight: isInvalid ? 700 : undefined,
            }}
          >
            {competency.expirationDate
              ? formatDate(competency.expirationDate)
              : '-'}
          </Typography>
        )
      },
    },
    {
      id: 'open',
      label: '',
      width: '5%',
      align: 'right',
      // The whole row is clickable and focusable, the icon only hints at it.
      render: () => <MoreHorizIcon fontSize="small" aria-hidden />,
    },
  ]

  return (
    <Box
      sx={{
        mx: 2,
        my: 1.5,
        p: 2,
        border: '2px solid #cbd5df',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        boxSizing: 'border-box',
      }}
    >
      <ExpandableTable
        ariaLabel={t('qualifications.competences.tableLabel')}
        rows={competences}
        columns={columns}
        getRowId={(competency) => String(competency.competencyId)}
        onRowClick={onCompetenceClick}
      />
    </Box>
  )
}
