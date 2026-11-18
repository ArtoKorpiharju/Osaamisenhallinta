import { useState } from 'react'
import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useTranslation } from 'react-i18next'

import { tones } from '../../config/tones'
import { type UnitPerson } from '../../types/overview'

// Logic for tabs in employee dialog
const tabs = ['overview', 'qualifications', 'competencies'] as const

type EmployeeDialogTab = (typeof tabs)[number]

interface EmployeeDialogProps {
  employee: UnitPerson | null
  open: boolean
  onClose: () => void
}

// Header, tabs and larger body of the employee specific view
function EmployeeDialogBody({
  employee,
  onClose,
}: {
  employee: UnitPerson
  onClose: () => void
}) {
  const { t } = useTranslation()

  const [tab, setTab] = useState<EmployeeDialogTab>('overview')

  return (
    <>
      <IconButton
        aria-label={t('myUnit.employeeDialog.close')}
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, pt: 2.5 }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: '#d8e6f3',
            color: tones.info.main,
          }}
        >
          <PersonOutlinedIcon />
        </Avatar>
        <Typography
          id="employee-dialog-title"
          variant="h2"
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: tones.info.main,
          }}
        >
          {employee.firstName} {employee.lastName}
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_event, value: EmployeeDialogTab) => {
          setTab(value)
        }}
        sx={{
          mt: 2,
          px: 2,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTabs-indicator': { bgcolor: tones.info.main },
        }}
      >
        {tabs.map((value) => (
          <Tab
            key={value}
            value={value}
            label={t(`myUnit.employeeDialog.tabs.${value}`)}
            id={`employee-dialog-tab-${value}`}
            aria-controls={`employee-dialog-tabpanel-${value}`}
            sx={{
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              color: 'text.secondary',
              '&.Mui-selected': { color: tones.info.main },
            }}
          />
        ))}
      </Tabs>

      {tabs.map((value) => (
        <Box
          key={value}
          role="tabpanel"
          id={`employee-dialog-tabpanel-${value}`}
          aria-labelledby={`employee-dialog-tab-${value}`}
          hidden={tab !== value}
          sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2 }}
        />
      ))}
    </>
  )
}

// Dialog showing the employee's details in tabs
function EmployeeDialog({ employee, open, onClose }: EmployeeDialogProps) {
  return (
    <Dialog
      open={open && employee !== null}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="employee-dialog-title"
      slotProps={{ paper: { sx: { height: '85vh' } } }}
    >
      {employee && <EmployeeDialogBody employee={employee} onClose={onClose} />}
    </Dialog>
  )
}

export default EmployeeDialog
