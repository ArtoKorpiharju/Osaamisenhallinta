import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Outlet, Route, Routes, useLocation } from 'react-router'
import EmployeeOverview from '../src/pages/employee/Overview'
import MyQualifications from '../src/components/EmployeeOverview/MyQualifications'
import ActionRequired from '../src/components/EmployeeOverview/ActionRequired'
import type {
  ActionRequiredItem,
  EmployeeQualification,
} from '../src/types/overview'

// Shows the current path so tests can check where a page navigated to.
function CurrentPath() {
  return <div data-testid="current-path">{useLocation().pathname}</div>
}

// Render page at the given path with Router
// without a userId the page doesn't fetch any data
function renderWithRouter(page: ReactElement, path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Outlet context={{ userId: undefined }} />}>
          <Route path={path} element={page} />
        </Route>
        <Route path="*" element={<CurrentPath />} />
      </Routes>
    </MemoryRouter>
  )
}

// Test data
const fakeEmployeeQualification: EmployeeQualification[] = [
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
    requirementsTotal: 2,
    validUntil: '2026-05-01',
    requiredCompetencies: [],
  },
]

const fakeActionItems: ActionRequiredItem[] = [
  {
    id: '3',
    title: 'Safety card',
    dueDate: '2026-12-24',
    status: { label: 'Expiring soon', tone: 'warning' },
    actions: [{ id: 'plan-renewal', label: 'Plan renewal' }],
  },
  {
    id: '4',
    title: 'Crane license',
    dueDate: '2026-09-30',
    status: { label: 'Expired', tone: 'danger' },
    actions: [
      { id: 'plan-renewal', label: 'Plan renewal' },
      { id: 'upload-certificate', label: 'Upload renewal certificate' },
    ],
    note: { text: 'No renewal planned', tone: 'danger' },
  },
]

describe('EmployeeOverview', () => {
  // Test the page loading
  it('shows the summary, qualifications and required actions', () => {
    renderWithRouter(<EmployeeOverview />, '/employee/overview')

    expect(
      screen.getByRole('heading', { name: 'Employee Overview' })
    ).toBeInTheDocument()

    // Summary cards rendered
    expect(screen.getByText('Invalid competencies')).toBeInTheDocument()
    expect(screen.getByText('Expiring within 90 days')).toBeInTheDocument()
    expect(screen.getByText('Missing renewals')).toBeInTheDocument()
    expect(screen.getByText('Planned renewals')).toBeInTheDocument()

    // Tables rendered
    expect(screen.getByText('My Qualifications')).toBeInTheDocument()
    expect(screen.getByText('Action required')).toBeInTheDocument()

    // View All opens the qualifications page
    fireEvent.click(screen.getByRole('button', { name: 'View All' }))
    expect(screen.getByTestId('current-path')).toHaveTextContent(
      '/employee/Qualifications'
    )
  })

  // Test qualifications table component
  it('renders rows in the qualifications table', () => {
    const onQualificationClick = vi.fn()
    render(
      <MyQualifications
        qualifications={fakeEmployeeQualification}
        onQualificationClick={onQualificationClick}
      />
    )

    // Expired qualifications are rendered and sorted
    const [, crane, welding] = screen.getAllByRole('row')

    expect(within(crane).getByText('Crane licence')).toBeInTheDocument()
    expect(within(crane).getByText('Critical')).toBeInTheDocument()
    expect(within(crane).getByText('Invalid')).toBeInTheDocument()
    expect(within(crane).getByText('0/2')).toBeInTheDocument()
    expect(within(crane).getByText('01.05.2026')).toBeInTheDocument()

    expect(within(welding).getByText('Welding certificate')).toBeInTheDocument()
    expect(
      within(welding).getByTitle('Primary qualification')
    ).toBeInTheDocument()
    expect(within(welding).getByText('Qualified')).toBeInTheDocument()
    expect(within(welding).getByText('3/3')).toBeInTheDocument()
    expect(within(welding).getByText('15.01.2027')).toBeInTheDocument()

    fireEvent.click(within(welding).getByText('Welding certificate'))
    expect(onQualificationClick).toHaveBeenCalledWith(
      fakeEmployeeQualification[0]
    )
  })

  // Test action required table component
  it('renders rows in the action required list', () => {
    const onAction = vi.fn()
    render(<ActionRequired items={fakeActionItems} onAction={onAction} />)

    // Expired items rendered
    const [safetyCard, craneLicense] = screen.getAllByRole('article')

    expect(
      within(safetyCard).getByRole('heading', {
        name: 'Crane license',
      })
    ).toBeInTheDocument()
    expect(within(safetyCard).getByText('Invalid')).toBeInTheDocument()
    expect(within(safetyCard).getByText('30.09.2026')).toBeInTheDocument()
    expect(
      within(safetyCard).getByText('No renewal planned')
    ).toBeInTheDocument()
    expect(within(safetyCard).getAllByRole('button')).toHaveLength(2)

    expect(
      within(craneLicense).getByRole('heading', { name: 'Safety card' })
    ).toBeInTheDocument()
    expect(within(craneLicense).getByText('Expiring soon')).toBeInTheDocument()
    expect(within(craneLicense).getByText('24.12.2026')).toBeInTheDocument()
    expect(
      within(craneLicense).queryByText('No renewal planned')
    ).not.toBeInTheDocument()

    fireEvent.click(
      within(safetyCard).getByRole('button', {
        name: 'Upload renewal certificate',
      })
    )
    // Clicking works
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: fakeActionItems[1].id }),
      'upload-certificate'
    )
  })
})
