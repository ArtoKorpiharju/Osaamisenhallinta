import { useState } from 'react'

import { Alert, Snackbar } from '@mui/material'
import { useOutletContext, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

import PageTitle from '../../components/PageTitle'
import PageContainer from '../../components/PageContainer'
import CompetenceDetailDialog from '../../components/Qualifications/CompetenceDetailDialog'
import ExploreQualifications from '../../components/Qualifications/ExploreQualifications'
import MyQualificationsTable from '../../components/Qualifications/QualificationsTable'
import RemoveQualificationDialog from '../../components/Qualifications/RemoveQualificationDialog'
import useQualifications from '../../hooks/useQualifications'
import {
  type EmployeeCompetency,
  type EmployeeQualification,
} from '../../types/overview'

interface SelectedCompetence {
  competence: EmployeeCompetency
  qualificationName: string
}

export default function Qualifications() {
  const { t } = useTranslation()
  const { userId } = useOutletContext<{ userId: number | undefined }>()
  const { id } = useParams()
  const parsedId = Number(id)
  const highlightedId =
    id !== undefined && Number.isInteger(parsedId) ? parsedId : undefined

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
    <PageContainer>
      <PageTitle>{t('qualifications.title')}</PageTitle>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && userId !== undefined && (
        <Alert severity="info">{t('qualifications.loading')}</Alert>
      )}

      <MyQualificationsTable
        key={highlightedId}
        qualifications={myQualifications}
        expandedQualificationId={highlightedId}
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
    </PageContainer>
  )
}
