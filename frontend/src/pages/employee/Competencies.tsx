import { useState } from 'react'
import { Alert, Paper, Snackbar } from '@mui/material'
import { useOutletContext } from 'react-router'
import { useTranslation } from 'react-i18next'

import MyCompetenciesTable from '../../components/Competencies/MyCompetenciesTable'
import RemoveCompetencyDialog from '../../components/Competencies/RemoveCompetencyDialog'
import SearchCompetence from '../../components/Competencies/SearchCompetence'
import ExploreCompetencies from '../../components/Competencies/ExploreCompetencies'
import CompetenceDetailDialog from '../../components/Qualifications/CompetenceDetailDialog'
import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import useCompetencies from '../../hooks/useCompetencies'
import { type EmployeeCompetency } from '../../types/overview'

export default function EmployeeCompetencies() {
  const { t } = useTranslation()
  const { userId } = useOutletContext<{ userId: number | undefined }>()

  const {
    competencies,
    catalogue,
    addedIds,
    loading,
    error,
    catalogueError,
    actionError,
    clearActionError,
    addCompetency,
    removeCompetency,
    saveRenewalPlan,
    renewCompetency,
  } = useCompetencies(userId)

  const [pendingRemoval, setPendingRemoval] =
    useState<EmployeeCompetency | null>(null)

  // Only the id is stored, so the dialog shows fresh data after a reload.
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected =
    competencies.find((c) => c.competencyId === selectedId) ?? null

  const handleConfirmRemove = () => {
    if (pendingRemoval) void removeCompetency(pendingRemoval)
    setPendingRemoval(null)
  }

  return (
    <PageContainer>
      <Paper
        variant="outlined"
        square
        sx={{ px: 2, pt: 0.5, pb: 2, borderColor: '#e0e3e8', bgcolor: '#fff' }}
      >
        <PageTitle>{t('competencies.my.title')}</PageTitle>

        {error && <Alert severity="error">{error}</Alert>}
        {loading && userId !== undefined && (
          <Alert severity="info">{t('competencies.loading')}</Alert>
        )}

        <SearchCompetence competencies={competencies}>
          {(filtered) => (
            <MyCompetenciesTable
              competencies={filtered}
              onRemove={setPendingRemoval}
              onCompetencyClick={(c) => {
                setSelectedId(c.competencyId)
              }}
            />
          )}
        </SearchCompetence>
      </Paper>

      <Paper variant="outlined" square sx={{ px: 2, pt: 0.5, pb: 2 }}>
        <PageTitle>{t('competencies.explore.title')}</PageTitle>

        {catalogueError && <Alert severity="error">{catalogueError}</Alert>}

        <ExploreCompetencies
          competencies={catalogue}
          addedIds={addedIds}
          onAdd={(competency, issueDate) => {
            void addCompetency(competency, issueDate)
          }}
        />
      </Paper>

      <RemoveCompetencyDialog
        open={pendingRemoval !== null}
        competencyName={pendingRemoval?.name}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setPendingRemoval(null)
        }}
      />

      <CompetenceDetailDialog
        competence={selected}
        qualificationName={t('competencies.my.title')}
        onClose={() => {
          setSelectedId(null)
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
}