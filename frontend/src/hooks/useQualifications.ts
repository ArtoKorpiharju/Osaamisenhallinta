import { useCallback, useMemo, useState } from 'react'

import { mockQualifications } from '../mocks/qualifications'
import { type QualificationDetails } from '../types/qualifications'

/**
 * Qualifications of the signed-in employee and the catalogue they can explore.
 * TODO: replace the mocks with API calls. Loading and error state belong here too,
 * so the page does not need to know where the data comes from.
 */
export default function useQualifications() {
  // Every qualification that can be explored.
  const catalogue = mockQualifications

  // Mock: the first five are already the user's.
  const [myQualifications, setMyQualifications] = useState<
    QualificationDetails[]
  >(() => mockQualifications.slice(0, 5))

  const addedIds = useMemo(
    () => new Set(myQualifications.map((qualification) => qualification.id)),
    [myQualifications]
  )

  const addQualification = useCallback(
    (qualification: QualificationDetails) => {
      setMyQualifications((current) =>
        current.some((item) => item.id === qualification.id)
          ? current
          : [...current, qualification]
      )
    },
    []
  )

  // Critical qualifications are employer requirements and cannot be removed.
  const removeQualification = useCallback((qualificationId: string) => {
    setMyQualifications((current) =>
      current.filter(
        (qualification) =>
          qualification.id !== qualificationId ||
          qualification.isCritical === true
      )
    )
  }, [])

  // `isPrimary` is the "My favorite" star
  const toggleFavorite = useCallback((qualificationId: string) => {
    setMyQualifications((current) =>
      current.map((qualification) =>
        qualification.id === qualificationId
          ? { ...qualification, isPrimary: qualification.isPrimary !== true }
          : qualification
      )
    )
  }, [])

  return {
    catalogue,
    myQualifications,
    addedIds,
    addQualification,
    removeQualification,
    toggleFavorite,
  }
}
