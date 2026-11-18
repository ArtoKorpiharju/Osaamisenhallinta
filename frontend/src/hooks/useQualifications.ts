import { useCallback, useEffect, useMemo, useState } from 'react'

import { getApiErrorMessage } from '../services/api'
import {
  assignQualification,
  deleteEmployeeQualification,
  fetchEmployeeQualifications,
  updateQualificationFavourite,
} from '../services/employee/employeeQualifications'
import {
  assignCompetency,
  deleteRenewalPlan,
  fetchEmployeeCompetencies,
  saveRenewalPlan as saveRenewalPlanRequest,
  updateCompetencyIssueDate,
  type RenewalPlanRequest,
} from '../services/employee/employeeCompetencies'
import {
  fetchQualificationCatalogue,
  type CatalogueApiResponse,
} from '../services/qualifications'
import {
  type EmployeeCompetency,
  type EmployeeQualification,
} from '../types/overview'
import { type CatalogueQualification } from '../types/qualifications'
import { buildCatalogue } from '../utils/qualifications'

/**
 * Qualifications of the signed-in employee and the catalogue they can explore.
 * Loading and error state live here so the page does not need to know
 * where the data comes from.
 */
export default function useQualifications(userId: number | undefined) {
  const [myQualifications, setMyQualifications] = useState<
    EmployeeQualification[]
  >([])
  const [catalogueSource, setCatalogueSource] = useState<
    CatalogueApiResponse[]
  >([])
  const [employeeCompetencies, setEmployeeCompetencies] = useState<
    EmployeeCompetency[]
  >([])

  const [loading, setLoading] = useState(true)
  // Error from loading the page data.
  const [error, setError] = useState<string | null>(null)
  // Error from add, remove, favourite or renewal. Shown separately so the tables stay visible.
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (userId === undefined) return

    // Ignore a late response if the user (role) changed while fetching.
    let ignore = false

    Promise.all([
      fetchEmployeeQualifications(userId),
      fetchEmployeeCompetencies(userId),
      fetchQualificationCatalogue(),
    ])
      .then(([mine, competencies, all]) => {
        if (ignore) return
        setMyQualifications(mine)
        setEmployeeCompetencies(competencies)
        setCatalogueSource(all)
        setError(null)
      })
      .catch((err: unknown) => {
        console.error('Loading qualifications failed:', err)

        if (ignore) return

        setError(
          getApiErrorMessage(err, 'Could not load qualifications', {
            400: 'Bad request for qualifications',
            404: 'Employee could not be found',
          })
        )
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [userId])

  // Derived, so the Critical badge and counts follow My Qualifications.
  const catalogue: CatalogueQualification[] = useMemo(
    () =>
      buildCatalogue(catalogueSource, employeeCompetencies, myQualifications),
    [catalogueSource, employeeCompetencies, myQualifications]
  )

  const addedIds = useMemo(
    () => new Set(myQualifications.map((q) => q.qualificationId)),
    [myQualifications]
  )

  // Reload the employee's own data after a renewal change. The backend
  // recalculates statuses, valid-until dates and requirement counts.
  const reload = useCallback(async () => {
    if (userId === undefined) return

    const [mine, competencies] = await Promise.all([
      fetchEmployeeQualifications(userId),
      fetchEmployeeCompetencies(userId),
    ])
    setMyQualifications(mine)
    setEmployeeCompetencies(competencies)
  }, [userId])

  const addQualification = useCallback(
    async (qualification: CatalogueQualification) => {
      if (userId === undefined) return

      try {
        const added = await assignQualification(
          userId,
          qualification.qualificationId
        )
        setMyQualifications((current) =>
          current.some((q) => q.qualificationId === added.qualificationId)
            ? current
            : [...current, added]
        )
      } catch (err: unknown) {
        setActionError(
          getApiErrorMessage(err, 'Could not add qualification', {
            404: 'Qualification could not be found',
            409: 'You already have this qualification',
          })
        )
      }
    },
    [userId]
  )

  // Critical qualifications are employer requirements and cannot be removed.
  const removeQualification = useCallback(
    async (qualificationId: number) => {
      const target = myQualifications.find(
        (q) => q.qualificationId === qualificationId
      )
      if (userId === undefined || !target || target.isCritical) return

      try {
        await deleteEmployeeQualification(
          userId,
          target.employeeQualificationId
        )
        setMyQualifications((current) =>
          current.filter((q) => q.qualificationId !== qualificationId)
        )
      } catch (err: unknown) {
        setActionError(
          getApiErrorMessage(err, 'Could not remove qualification', {
            403: 'Critical qualifications cannot be removed',
            404: 'Qualification could not be found',
          })
        )
      }
    },
    [userId, myQualifications]
  )

  // Update the star right away and undo it if the backend rejects the change.
  const toggleFavorite = useCallback(
    async (qualificationId: number) => {
      const target = myQualifications.find(
        (q) => q.qualificationId === qualificationId
      )
      if (userId === undefined || !target) return

      const next = !target.isFavourite
      const setFavourite = (value: boolean) => {
        setMyQualifications((current) =>
          current.map((q) =>
            q.qualificationId === qualificationId
              ? { ...q, isFavourite: value }
              : q
          )
        )
      }

      setFavourite(next)

      try {
        await updateQualificationFavourite(
          userId,
          target.employeeQualificationId,
          next
        )
      } catch (err: unknown) {
        setFavourite(!next)
        setActionError(
          getApiErrorMessage(err, 'Could not update favourite', {
            404: 'Qualification could not be found',
          })
        )
      }
    },
    [userId, myQualifications]
  )

  // Save the renewal plan, or delete it when `plan` is null.
  // Plans can only be attached to competencies the employee already has.
  const saveRenewalPlan = useCallback(
    async (competence: EmployeeCompetency, plan: RenewalPlanRequest | null) => {
      const employeeCompetencyId = competence.employeeCompetencyId
      if (userId === undefined || employeeCompetencyId === null) return

      try {
        if (plan === null) {
          await deleteRenewalPlan(userId, employeeCompetencyId)
        } else {
          await saveRenewalPlanRequest(userId, employeeCompetencyId, plan)
        }
        await reload()
      } catch (err: unknown) {
        setActionError(
          getApiErrorMessage(err, 'Could not save renewal plan', {
            400: 'Invalid renewal plan',
            404: 'Competency could not be found',
          })
        )
      }
    },
    [userId, reload]
  )

  // Renew a competency with a new issue date. A missing competency is
  // assigned to the employee, an existing one gets its issue date updated.
  const renewCompetency = useCallback(
    async (competence: EmployeeCompetency, issueDate: string) => {
      if (userId === undefined) return

      try {
        if (competence.employeeCompetencyId === null) {
          await assignCompetency(userId, competence.competencyId, issueDate)
        } else {
          await updateCompetencyIssueDate(
            userId,
            competence.employeeCompetencyId,
            issueDate
          )
        }
        await reload()
      } catch (err: unknown) {
        setActionError(
          getApiErrorMessage(err, 'Could not renew competency', {
            400: 'Invalid issue date',
            404: 'Competency could not be found',
            409: 'You already have this competency',
          })
        )
      }
    },
    [userId, reload]
  )

  const clearActionError = useCallback(() => {
    setActionError(null)
  }, [])

  return {
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
  }
}
