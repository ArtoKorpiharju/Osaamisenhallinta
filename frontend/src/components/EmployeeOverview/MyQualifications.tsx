import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import StarIcon from '@mui/icons-material/Star'

import CriticalBadge from '../CriticalBadge'
import GenericTable, { type DataTableColumn } from '../DataTable'
import Panel from '../Panel'
import StatusChip from '../StatusChip'
import { type Tone, tones } from '../../config/tones'
import {
  type EmployeeQualification,
  type QualificationStatus,
} from '../../types/overview'
import { formatDate } from '../../utils/formatDate'
import QualificationLegend from '../QualificationLegend'

interface MyQualificationsProps {
  qualifications: readonly EmployeeQualification[]
  onViewAll?: () => void
  onQualificationClick?: (qualification: EmployeeQualification) => void
}

const statusOrder: Record<QualificationStatus, number> = {
  notQualified: 0,
  expiringSoon: 1,
  qualified: 2,
}

function Legend() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 24px',
        color: '#174f83',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <StarIcon
          fontSize="small"
          sx={{ color: tones.star.main, stroke: 'black', strokeWidth: 0.5 }}
        />
        <Typography sx={{ fontSize: 13 }}>
          = {t('employeeOverview.qualifications.favorite')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <CriticalBadge />
        <Typography sx={{ fontSize: 13 }}>
          = {t('employeeOverview.qualifications.employerRequirement')}
        </Typography>
      </Box>
    </Box>
  )
}

export default function MyQualifications({
  qualifications,
  onViewAll,
  onQualificationClick,
}: MyQualificationsProps) {
  const { t } = useTranslation()

  const statusDisplay: Record<
    QualificationStatus,
    { label: string; tone: Tone }
  > = {
    notQualified: {
      label: t('employeeOverview.qualifications.statuses.invalid'),
      tone: 'danger',
    },
    expiringSoon: {
      label: t('employeeOverview.qualifications.statuses.expiringSoon'),
      tone: 'warning',
    },
    qualified: {
      label: t('employeeOverview.qualifications.statuses.qualified'),
      tone: 'success',
    },
  }

  const columns: DataTableColumn<EmployeeQualification>[] = [
    {
      id: 'name',
      label: t('employeeOverview.qualifications.columns.qualification'),
      minWidth: 360,
      render: (qualification) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: '100%',
            fontWeight: 600,
          }}
        >
          <Box sx={{ flexShrink: 0, width: 88 }}>
            {qualification.isCritical && <CriticalBadge />}
          </Box>

          {qualification.name}

          {qualification.isFavourite && (
            <StarIcon
              fontSize="small"
              titleAccess={t(
                'employeeOverview.qualifications.primaryQualification'
              )}
              sx={{
                flexShrink: 0,
                color: tones.star.main,
                stroke: 'black',
                strokeWidth: 0.5,
              }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: t('employeeOverview.qualifications.columns.status'),
      minWidth: 120,
      render: (qualification) => (
        <StatusChip
          label={statusDisplay[qualification.status].label}
          tone={statusDisplay[qualification.status].tone}
        />
      ),
    },
    {
      id: 'requirements',
      label: t('employeeOverview.qualifications.columns.requirements'),
      align: 'center',
      minWidth: 120,
      render: (qualification) => (
        <Box sx={{ fontWeight: 600 }}>
          {qualification.requirementsMet}/{qualification.requirementsTotal}
        </Box>
      ),
    },
    {
      id: 'validUntil',
      label: t('employeeOverview.qualifications.columns.validUntil'),
      align: 'right',
      minWidth: 100,
      render: (qualification) => (
        <Box sx={{ fontWeight: 600 }}>
          {qualification.validUntil
            ? formatDate(qualification.validUntil)
            : t('employeeOverview.qualifications.noExpiryDate')}
        </Box>
      ),
    },
  ]

  return (
    <Panel
      title={t('employeeOverview.qualifications.title')}
      headerAction={
        onViewAll && (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={onViewAll}
            sx={{ textTransform: 'none', color: tones.info.main }}
          >
            {t('employeeOverview.qualifications.viewAll')}
          </Button>
        )
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          height: '100%',
        }}
      >
        <Legend />

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <GenericTable
            columns={columns}
            rows={[...qualifications].sort(
              (a, b) => statusOrder[a.status] - statusOrder[b.status]
            )}
            getRowId={(qualification) => qualification.employeeQualificationId}
            onRowClick={onQualificationClick}
          />
        </Box>
      </Box>
    </Panel>
  )
}
