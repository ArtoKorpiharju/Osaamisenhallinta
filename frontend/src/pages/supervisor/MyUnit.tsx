import { Alert, Stack, Typography } from '@mui/material'
import { useOutletContext } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageTitle from '../../components/PageTitle'
import PageContainer from '../../components/PageContainer'
import { tones } from '../../config/tones'

import MyUnitTable, {
  type MyUnitItem,
} from '../../components/MyUnit/MyUnitTable'
import UnitSupervisors from '../../components/MyUnit/UnitSupervisors'
import EmployeeDialog from '../../components/MyUnit/EmployeeDialog'
import {
  type UnitDetails,
  type UnitEmployeeQualifications,
  type UnitPerson,
} from '../../types/overview'
import { fetchUnitDetails } from '../../services/supervisor/myUnit'
import { getApiErrorMessage } from '../../services/api'

// Style for section headlines
const sectionTitleSx = {
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: 'normal',
  color: tones.info.main,
}

// Create table rows with critical qualification, qualification, competency
// and renwal counts per employee. The table search matches the employee's
// own name as well as qualification and competency names.
function createMyUnitItems(
  employees: UnitEmployeeQualifications[]
): MyUnitItem[] {
  return [...employees]
    .sort(
      (a, b) =>
        a.employee.lastName.localeCompare(b.employee.lastName) ||
        a.employee.firstName.localeCompare(b.employee.firstName)
    )
    .map(({ employee, qualifications, competencies }) => ({
      id: employee.id,
      employee: `${employee.firstName} ${employee.lastName}`,
      criticalQualifications: qualifications.filter(
        (qualification) => qualification.isCritical
      ).length,
      qualifications: qualifications.length,
      competencies: competencies.filter(
        (competency) => competency.status !== 'missing'
      ).length,
      plannedRenewals: competencies.filter(
        (competency) => competency.renewalPlan !== null
      ).length,
      searchTerms: [
        ...qualifications.map((qualification) => qualification.name),
        ...competencies.map((competency) => competency.name),
      ],
    }))
}

export default function SupervisorMyUnit() {
  const { t } = useTranslation()

  const { unitId } = useOutletContext<{ unitId: number | undefined }>()

  const [unit, setUnit] = useState<UnitDetails>({
    supervisors: [],
    employees: [],
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [dialogEmployee, setDialogEmployee] = useState<UnitPerson | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Remember the data to lessen the need for API calls
  const items = useMemo(
    () => createMyUnitItems(unit.employees),
    [unit.employees]
  )

  // Fetch the data for the table
  useEffect(() => {
    if (unitId === undefined) return

    fetchUnitDetails(unitId)
      .then(setUnit)
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(err, 'Could not load unit data', {
            400: 'Bad request for unit data',
            404: 'Unit or employee data could not be found',
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [unitId])

  // Page container
  return (
    <PageContainer>
      <PageTitle>{t('myUnit.title')}</PageTitle>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && unitId !== undefined && (
        <Alert severity="info">Fetching unit data…</Alert>
      )}

      <Stack
        component="section"
        spacing={2}
        aria-labelledby="unit-supervisors-title"
      >
        <Typography
          id="unit-supervisors-title"
          variant="h2"
          sx={sectionTitleSx}
        >
          {t('myUnit.sections.supervisors')}
        </Typography>
        <UnitSupervisors supervisors={unit.supervisors} />
      </Stack>

      <Stack
        component="section"
        spacing={2}
        aria-labelledby="unit-employees-title"
      >
        <Typography id="unit-employees-title" variant="h2" sx={sectionTitleSx}>
          {t('myUnit.sections.employees')}
        </Typography>
        <MyUnitTable
          items={items}
          onEmployeeClick={(item) => {
            const found = unit.employees.find(
              ({ employee }) => employee.id === item.id
            )
            if (!found) return

            setDialogEmployee(found.employee)
            setDialogOpen(true)
          }}
        />
      </Stack>

      <EmployeeDialog
        employee={dialogEmployee}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
        }}
      />
    </PageContainer>
  )
}
