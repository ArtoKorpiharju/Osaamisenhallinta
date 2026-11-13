import { useCallback, useEffect, useMemo, useState } from 'react'

import { getApiErrorMessage } from '../services/api'
import {
  assignQualification,
  deleteEmployeeQualification,
  fetchEmployeeQualifications,
  updateQualificationFavourite,
} from '../services/employee/employeeQualifications'
import { fetchEmployeeCompetencies } from '../services/employee/employeeCompetencies'
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
  // Error from add, remove or favourite. Shown separately so the tables stay visible.
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
  }
}
