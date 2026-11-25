import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Outlet, Route, Routes } from 'react-router'
import Qualifications from '../src/pages/employee/Qualifications'
import MyQualificationsTable from '../src/components/Qualifications/QualificationsTable'
import ExploreQualifications from '../src/components/Qualifications/ExploreQualifications'
import type {
  EmployeeCompetency,
  EmployeeQualification,
} from '../src/types/overview'
import type { CatalogueQualification } from '../src/types/qualifications'

// Render page at the given path with Router
// without a userId the page doesn't fetch any data
function renderWithRouter(page: ReactElement, path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Outlet context={{ userId: undefined }} />}>
          <Route path={path} element={page} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

// Test data
const fakeCompetency: EmployeeCompetency = {
  employeeCompetencyId: 1,
  competencyId: 10,
  name: 'Forklift licence',
  type: 'license',
  issueDate: '2022-03-01',
  expirationDate: '2026-03-01',
  status: 'expired',
  renewalPlan: null,
}

const fakeQualifications: EmployeeQualification[] = [
  {
    employeeQualificationId: 1,
    qualificationId: 1,
    name: 'Welding certificate',
    isFavourite: true,
    isCritical: false,
    status: 'qualified',
    requirementsMet: 3,
    requirementsTotal: 3,
    validUntil: '2027-01-15',
    requiredCompetencies: [],
  },
  {
    employeeQualificationId: 2,
    qualificationId: 2,
    name: 'Crane licence',
    isFavourite: false,
    isCritical: true,
    status: 'notQualified',
    requirementsMet: 0,
    requirementsTotal: 1,
    validUntil: '2026-05-01',
    requiredCompetencies: [fakeCompetency],
  },
]

const fakeCatalogue: CatalogueQualification[] = [
  {
    qualificationId: 1,
    name: 'Welding certificate',
    isCritical: false,
    requirementsTotal: 3,
    requirementsMet: 3,
    requiredCompetencies: [],
  },
  {
    qualificationId: 3,
    name: 'Rope access',
    isCritical: false,
    requirementsTotal: 2,
    requirementsMet: 0,
    requiredCompetencies: [],
  },
]

describe('Qualifications', () => {
  // Test the page loading
  it('shows the my qualifications and explore sections', () => {
    renderWithRouter(<Qualifications />, '/employee/qualifications')

    expect(
      screen.getByRole('heading', { name: 'Employee Qualifications' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'My Qualifications' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Explore Qualifications' })
    ).toBeInTheDocument()

    // Empty tables
    expect(
      screen.getByText('You have no qualifications yet.')
    ).toBeInTheDocument()
    expect(screen.getByText('No qualifications found.')).toBeInTheDocument()
  })

  // Test my qualifications table component
  it('renders rows in the my qualifications table', () => {
    const onCompetenceClick = vi.fn()
    const onRemove = vi.fn()
    render(
      <MyQualificationsTable
        qualifications={fakeQualifications}
        onCompetenceClick={onCompetenceClick}
        onRemove={onRemove}
      />
    )

    // Rows are found by name because every row has a hidden expand row after it
    const crane = screen.getByRole('row', { name: /Crane licence/ })
    const welding = screen.getByRole('row', { name: /Welding certificate/ })

    expect(within(crane).getByText('Critical')).toBeInTheDocument()
    expect(within(crane).getByText('Invalid')).toBeInTheDocument()
    expect(within(crane).getByText('0/1')).toBeInTheDocument()
    expect(within(crane).getByText('01.05.2026')).toBeInTheDocument()

    expect(within(welding).getByText('Qualified')).toBeInTheDocument()
    expect(within(welding).getByText('3/3')).toBeInTheDocument()
    expect(within(welding).getByText('15.01.2027')).toBeInTheDocument()

    // Critical qualification cannot be removed, others can
    expect(
      within(crane).getByRole('button', {
        name: 'Crane licence is critical and cannot be removed',
      })
    ).toBeDisabled()
    fireEvent.click(
      within(welding).getByRole('button', {
        name: 'Remove Welding certificate',
      })
    )
    expect(onRemove).toHaveBeenCalledWith(fakeQualifications[0])

    // Expanding a row shows its competences
    fireEvent.click(within(crane).getByText('Crane licence'))
    fireEvent.click(screen.getByText('Forklift licence'))
    expect(onCompetenceClick).toHaveBeenCalledWith(
      fakeCompetency,
      fakeQualifications[1]
    )
  })

  // Test explore qualifications component
  it('lets the user search and add qualifications', () => {
    const onAdd = vi.fn()
    render(
      <ExploreQualifications
        qualifications={fakeCatalogue}
        addedIds={new Set([1])}
        onAdd={onAdd}
        onCompetenceClick={vi.fn()}
      />
    )

    // Already added qualification cannot be added again
    const welding = screen.getByRole('row', { name: /Welding certificate/ })
    expect(
      within(welding).getByRole('button', { name: 'Added' })
    ).toBeDisabled()

    // Adding works
    const rope = screen.getByRole('row', { name: /Rope access/ })
    fireEvent.click(within(rope).getByRole('button', { name: 'Add' }))
    expect(onAdd).toHaveBeenCalledWith(fakeCatalogue[1])

    // Search filters the list
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Search qualifications' }),
      { target: { value: 'rope' } }
    )
    expect(screen.getByText('Rope access')).toBeInTheDocument()
    expect(screen.queryByText('Welding certificate')).not.toBeInTheDocument()
  })
})
