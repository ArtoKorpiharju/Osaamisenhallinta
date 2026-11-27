import { Avatar, Box, Paper, Typography } from '@mui/material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'

import { tones } from '../../config/tones'
import { type UnitPerson } from '../../types/overview'

interface UnitSupervisorsProps {
  supervisors: UnitPerson[]
}

// Show unit supervisor cards
function UnitSupervisors({ supervisors }: UnitSupervisorsProps) {
  return (
    <Box
      component="ul"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: 6,
        rowGap: 2,
        p: 0,
        listStyle: 'none',
      }}
    >
      {supervisors.map((supervisor) => (
        <Paper
          key={supervisor.id}
          component="li"
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: 260,
            maxWidth: '100%',
            boxSizing: 'border-box',
            px: 1,
            py: 1,
            borderRadius: 2,
            bgcolor: '#ffffff',
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#d8e6f3',
              color: tones.info.main,
            }}
          >
            <PersonOutlinedIcon fontSize="small" />
          </Avatar>
          <Typography
            component="span"
            sx={{
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 2,
              color: tones.info.main,
            }}
          >
            {supervisor.firstName} {supervisor.lastName}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}

export default UnitSupervisors
