import { useState } from 'react'

import { Box, Typography } from '@mui/material'

import CompetenceDetailDialog from '../../components/Qualifications/CompetenceDetailDialog'
import ExploreQualifications from '../../components/Qualifications/ExploreQualifications'
import MyQualificationsTable from '../../components/Qualifications/QualificationsTable'
import RemoveQualificationDialog from '../../components/Qualifications/RemoveQualificationDialog'
import { tones } from '../../config/tones'
import useQualifications from '../../hooks/useQualifications'
import {
  type Competence,
  type QualificationDetails,
} from '../../types/qualifications'

interface SelectedCompetence {
  competence: Competence
  qualificationName: string
}

export default function Qualifications() {
  const {
    catalogue,
    myQualifications,
    addedIds,
    addQualification,
    removeQualification,
    toggleFavorite,
  } = useQualifications()

  const [pendingRemoval, setPendingRemoval] =
    useState<QualificationDetails | null>(null)
  const [selected, setSelected] = useState<SelectedCompetence | null>(null)

  const handleConfirmRemove = () => {
    if (pendingRemoval) {
      removeQualification(pendingRemoval.id)
    }
    setPendingRemoval(null)
  }

  const openCompetence = (
    competence: Competence,
    qualification: QualificationDetails
  ) => {
    setSelected({ competence, qualificationName: qualification.name })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Typography
        component="h1"
        sx={{ fontSize: 18, fontWeight: 700, color: tones.info.main }}
      >
        Qualifications
      </Typography>

      <MyQualificationsTable
        qualifications={myQualifications}
        onCompetenceClick={openCompetence}
        onRemove={setPendingRemoval}
        onToggleFavorite={(qualification) => {
          toggleFavorite(qualification.id)
        }}
      />

      <ExploreQualifications
        qualifications={catalogue}
        addedIds={addedIds}
        onAdd={addQualification}
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
    </Box>
  )
}
