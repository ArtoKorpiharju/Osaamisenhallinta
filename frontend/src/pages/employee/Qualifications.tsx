import { useState } from 'react'

import { Alert, Box, Snackbar, Typography } from '@mui/material'
import { useOutletContext } from 'react-router'

import CompetenceDetailDialog from '../../components/Qualifications/CompetenceDetailDialog'
import ExploreQualifications from '../../components/Qualifications/ExploreQualifications'
import MyQualificationsTable from '../../components/Qualifications/QualificationsTable'
import RemoveQualificationDialog from '../../components/Qualifications/RemoveQualificationDialog'
import { tones } from '../../config/tones'
import useQualifications from '../../hooks/useQualifications'
import { type EmployeeCompetency } from '../../types/overview'
import { type EmployeeQualification } from '../../types/overview'

interface SelectedCompetence {
  competence: EmployeeCompetency
  qualificationName: string
}

export default function Qualifications() {
  const { userId } = useOutletContext<{ userId: number | undefined }>()

  const {
    catalogue,
    myQualifications,
    addedIds,
    loading,
    error,
    actionError,
    clearActionError,
    addQualification,
    removeQualification,
    toggleFavorite,
  } = useQualifications(userId)

  const [pendingRemoval, setPendingRemoval] =
    useState<EmployeeQualification | null>(null)

  const [selected, setSelected] = useState<SelectedCompetence | null>(null)

  const handleConfirmRemove = () => {
    if (pendingRemoval) {
      void removeQualification(pendingRemoval.qualificationId)
    }
    setPendingRemoval(null)
  }

  const openCompetence = (
    competence: EmployeeCompetency,
    qualification: { name: string }
  ) => {
    setSelected({
      competence,
      qualificationName: qualification.name,
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Typography
        component="h1"
        sx={{ fontSize: 18, fontWeight: 700, color: tones.info.main }}
      >
        Qualifications
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && userId !== undefined && (
        <Alert severity="info">Fetching qualifications…</Alert>
      )}

      <MyQualificationsTable
        qualifications={myQualifications}
        onCompetenceClick={openCompetence}
        onRemove={setPendingRemoval}
        onToggleFavorite={(qualification) => {
          void toggleFavorite(qualification.qualificationId)
        }}
      />

      <ExploreQualifications
        qualifications={catalogue}
        addedIds={addedIds}
        onAdd={(qualification) => {
          void addQualification(qualification)
        }}
        onCompetenceClick={openCompetence}
      />

      <RemoveQualificationDialog
        open={pendingRemoval !== null}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setPendingRemoval(null)
        }}
      />

      <CompetenceDetailDialog
        competence={selected?.competence ?? null}
        qualificationName={selected?.qualificationName}
        onClose={() => {
          setSelected(null)
        }}
      />

      <Snackbar
        open={actionError !== null}
        autoHideDuration={6000}
        onClose={clearActionError}
      >
        <Alert severity="error" onClose={clearActionError}>
          {actionError}
        </Alert>
      </Snackbar>
    </Box>
  )
}
