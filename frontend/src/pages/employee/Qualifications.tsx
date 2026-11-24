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

// Only ids are stored. The dialog reads the competence from the loaded data,
// so it shows the new values right after a renewal change is saved.
interface SelectedCompetence {
  competencyId: number
  qualificationId: number
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
    saveRenewalPlan,
    renewCompetency,
  } = useQualifications(userId)

  const [pendingRemoval, setPendingRemoval] =
    useState<EmployeeQualification | null>(null)

  const [selected, setSelected] = useState<SelectedCompetence | null>(null)

  const selectedQualification = selected
    ? catalogue.find((q) => q.qualificationId === selected.qualificationId)
    : undefined
  const selectedCompetence =
    selectedQualification?.requiredCompetencies.find(
      (c) => c.competencyId === selected?.competencyId
    ) ?? null

  const handleConfirmRemove = () => {
    if (pendingRemoval) {
      void removeQualification(pendingRemoval.qualificationId)
    }
    setPendingRemoval(null)
  }

  const openCompetence = (
    competence: EmployeeCompetency,
    qualification: { qualificationId: number }
  ) => {
    setSelected({
      competencyId: competence.competencyId,
      qualificationId: qualification.qualificationId,
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
        competence={selectedCompetence}
        qualificationName={selectedQualification?.name}
        onClose={() => {
          setSelected(null)
        }}
        onSaveRenewalPlan={(competence, plan) => {
          void saveRenewalPlan(competence, plan)
        }}
        onConfirmRenewal={(competence, issueDate) => {
          void renewCompetency(competence, issueDate)
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
import PageTitle from '../../components/PageTitle'

export default function EmployeeQualifications() {
  return <PageTitle>Employee Qualifications</PageTitle>
}
