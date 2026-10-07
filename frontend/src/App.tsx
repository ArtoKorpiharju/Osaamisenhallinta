import { Box, Typography } from '@mui/material'
import UpcomingExpirationsTable from './components/UpcomingExpirationsTable'

function App() {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f7fc',
        minHeight: '100vh',
        padding: 4,
        width: '100vw',
      }}
    >
      <Box
        sx={{
          marginX: 'auto',
          maxWidth: 1200,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            color: '#004080',
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          Overview
        </Typography>

        <UpcomingExpirationsTable
        onItemClick={(item) => {
        window.alert(`${item.employee}: ${item.competency}`)
        }}
        />
      </Box>
    </Box>
  )
}

export default App