import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getApiErrorMessage } from '../services/api'
import { fetchCompetencies } from '../services/competencies'
import {
  assignCompetency,
  deleteEmployeeCompetency,
  deleteRenewalPlan,
  fetchEmployeeCompetencies,
  saveRenewalPlan as saveRenewalPlanRequest,
  updateCompetencyIssueDate,
  type RenewalPlanRequest,
} from '../services/employee/employeeCompetencies'
import { type CatalogueCompetency } from '../types/competencies'
import { type EmployeeCompetency } from '../types/overview'

export default function useCompetencies(userId: number | undefined) {
  const { t } = useTranslation()

  const [competencies, setCompetencies] = useState<EmployeeCompetency[]>([])
  const [catalogue, setCatalogue] = useState<CatalogueCompetency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [catalogueError, setCatalogueError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    fetchCompetencies()
      .then(setCatalogue)
      .catch((err: unknown) => {
        setCatalogueError(
          getApiErrorMessage(err, t('competencies.errors.loadCatalogue'))
        )
      })
  }, [t])

  useEffect(() => {
    if (userId === undefined) return
    let ignore = false

    fetchEmployeeCompetencies(userId)
      .then((data) => {
        if (!ignore) setCompetencies(data)
      })
      .catch((err: unknown) => {
        if (ignore) return
        setError(
          getApiErrorMessage(err, t('competencies.errors.load'), {
            404: t('competencies.errors.loadNotFound'),
          })
        )
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [userId, t])

  const addedIds = useMemo(
    () =>
      new Set(
        competencies
          .filter((c) => c.employeeCompetencyId !== null)
          .map((c) => c.competencyId)
      ),
    [competencies]
  )

  const reload = useCallback(async () => {
    if (userId === undefined) return
    setCompetencies(await fetchEmployeeCompetencies(userId))
  }, [userId])

  // Yhteinen kääre: suorittaa toiminnon, lataa uudelleen ja hoitaa virheen.
  const run = useCallback(
    async (
      action: () => Promise<unknown>,
      fallbackKey: string,
      statusKeys: Partial<Record<number, string>> = {}
    ) => {
      try {
        await action()
        await reload()
        setActionError(null)
      } catch (err: unknown) {
        const messages = Object.fromEntries(
          Object.entries(statusKeys).map(([status, key]) => [status, t(key)])
        )
        setActionError(getApiErrorMessage(err, t(fallbackKey), messages))
      }
    },
    [reload, t]
  )

  const addCompetency = useCallback(
    (competency: CatalogueCompetency, issueDate: string) => {
      if (userId === undefined) return Promise.resolve()
      return run(
        () => assignCompetency(userId, competency.competencyId, issueDate),
        'competencies.errors.add',
        {
          400: 'competencies.errors.addInvalidDate',
          404: 'competencies.errors.addNotFound',
          409: 'competencies.errors.addConflict',
        }
      )
    },
    [userId, run]
  )

  const removeCompetency = useCallback(
    (competence: EmployeeCompetency) => {
      const id = competence.employeeCompetencyId
      if (userId === undefined || id === null) return Promise.resolve()
      return run(
        () => deleteEmployeeCompetency(userId, id),
        'competencies.errors.remove',
        { 404: 'competencies.errors.removeNotFound' }
      )
    },
    [userId, run]
  )

  const saveRenewalPlan = useCallback(
    (competence: EmployeeCompetency, plan: RenewalPlanRequest | null) => {
      const id = competence.employeeCompetencyId
      if (userId === undefined || id === null) return Promise.resolve()
      return run(
        () =>
          plan === null
            ? deleteRenewalPlan(userId, id)
            : saveRenewalPlanRequest(userId, id, plan),
        'competencies.errors.saveRenewalPlan',
        {
          400: 'competencies.errors.invalidRenewalPlan',
          404: 'competencies.errors.removeNotFound',
        }
      )
    },
    [userId, run]
  )

  const renewCompetency = useCallback(
    (competence: EmployeeCompetency, issueDate: string) => {
      if (userId === undefined) return Promise.resolve()
      return run(
        () =>
          competence.employeeCompetencyId === null
            ? assignCompetency(userId, competence.competencyId, issueDate)
            : updateCompetencyIssueDate(
                userId,
                competence.employeeCompetencyId,
                issueDate
              ),
        'competencies.errors.renew',
        {
          400: 'competencies.errors.invalidIssueDate',
          404: 'competencies.errors.removeNotFound',
        }
      )
    },
    [userId, run]
  )

  const clearActionError = useCallback(() => {
    setActionError(null)
  }, [])

  return {
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
  }
}