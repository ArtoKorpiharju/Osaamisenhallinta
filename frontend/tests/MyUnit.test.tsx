import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { MemoryRouter, Outlet, Route, Routes } from 'react-router'
import SupervisorMyUnit from '../src/pages/supervisor/MyUnit'

// Render page at the given path with Router
// without a unitId the page doesn't fetch any data
function renderWithRouter(page: ReactElement, path: string, unitId?: number) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Outlet context={{ unitId }} />}>
          <Route path={path} element={page} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

// Replace fetch with a mock that returns the response for each URL,
// or 404 for unknown URLs.
function mockFetch(responses: Record<string, unknown>) {
  const fetchMock = vi.fn((url: string) => {
    const found = url in responses
    return Promise.resolve({
      ok: found,
      status: found ? 200 : 404,
      json: () => Promise.resolve(responses[url]),
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// Fake required competency in the API response format
function fakeCompetency(
  competencyId: number,
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'MISSING',
  hasRenewalPlan = false
) {
  const employeeCompetencyId = status === 'MISSING' ? null : competencyId + 100

  return {
    employeeCompetencyId,
    competencyId,
    competencyName: `Competency ${String(competencyId)}`,
    competencyType: 'TRAINING',
    issueDate: status === 'MISSING' ? null : '2025-01-01',
    expirationDate: status === 'MISSING' ? null : '2027-01-01',
    status,
    renewalPlan: hasRenewalPlan
      ? {
          id: competencyId,
          employeeCompetencyId,
          renewalDate: '2026-12-01',
          renewalComment: null,
        }
      : null,
  }
}

// Fake qualification in the API response format
function fakeQualification(
  id: number,
  critical: boolean,
  requiredCompetencies: ReturnType<typeof fakeCompetency>[]
) {
  return {
    employeeQualificationId: id,
    qualificationId: id,
    qualificationName: `Qualification ${String(id)}`,
    favourite: false,
    critical,
    validUntil: null,
    status: 'NOT_QUALIFIED',
    totalRequirementsCount: requiredCompetencies.length,
    metRequirementsCount: 0,
    requiredCompetencies,
  }
}

const fakeResponses = {
  '/api/units/7/overview': {
    unitId: 7,
    unitName: 'Warehouse',
    supervisors: [
      { id: 9, firstName: 'Matti', lastName: 'Mattinen' },
      { id: 10, firstName: 'Joe', lastName: 'Don' },
    ],
    employees: [
      { employeeId: 3, employeeFirstName: 'Mika', employeeLastName: 'Niemi' },
      {
        employeeId: 2,
        employeeFirstName: 'Anna',
        employeeLastName: 'Korhonen',
      },
    ],
  },
  '/api/employees/2/qualifications': [
    fakeQualification(1, true, [
      fakeCompetency(1, 'EXPIRING_SOON'),
      fakeCompetency(4, 'VALID'),
    ]),
    fakeQualification(2, true, [
      fakeCompetency(2, 'VALID'),
      fakeCompetency(3, 'VALID'),
    ]),
  ],
  '/api/employees/3/qualifications': [
    fakeQualification(1, true, [
      fakeCompetency(1, 'EXPIRED'),
      fakeCompetency(4, 'EXPIRING_SOON', true),
    ]),
    fakeQualification(4, false, [
      fakeCompetency(8, 'VALID'),
      fakeCompetency(7, 'MISSING'),
    ]),
    // Competency 1 is also required by this qualification
    fakeQualification(5, false, [fakeCompetency(1, 'EXPIRED')]),
  ],
  // All the competencies the employees have. Competencies 6 and 9
  // are not required by any qualification. Competency 9 has a renewal plan.
  '/api/employees/2/competencies': [
    fakeCompetency(1, 'EXPIRING_SOON'),
    fakeCompetency(2, 'VALID'),
    fakeCompetency(3, 'VALID'),
    fakeCompetency(4, 'VALID'),
    fakeCompetency(6, 'VALID'),
  ],
  '/api/employees/3/competencies': [
    fakeCompetency(1, 'EXPIRED'),
    fakeCompetency(4, 'EXPIRING_SOON', true),
    fakeCompetency(8, 'VALID'),
    fakeCompetency(9, 'VALID', true),
  ],
}

// Get the text of each cell in a table row.
function getCellTexts(row: HTMLElement) {
  return within(row)
    .getAllByRole('gridcell')
    .map((cell) => cell.textContent)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SupervisorMyUnit', () => {
  it('shows the title and the employees table', () => {
    renderWithRouter(<SupervisorMyUnit />, '/supervisor/my-unit')

    expect(screen.getByRole('heading', { name: 'My unit' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Unit supervisors' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Unit employees' })
    ).toBeInTheDocument()
    // The section title names the table, so the table has no own header.
    expect(
      screen.queryByRole('heading', { name: 'Employees' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Employee name' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Critical qualifications' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Renewals planned' })
    ).toBeInTheDocument()
  })

  // Test the page with data from the unit and employee endpoints
  it("shows qualification counts for the unit's employees", async () => {
    const fetchMock = mockFetch(fakeResponses)

    renderWithRouter(<SupervisorMyUnit />, '/supervisor/my-unit', 7)

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(3)
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/units/7/overview')
    expect(fetchMock).toHaveBeenCalledWith('/api/employees/2/qualifications')
    expect(fetchMock).toHaveBeenCalledWith('/api/employees/3/qualifications')
    expect(fetchMock).toHaveBeenCalledWith('/api/employees/2/competencies')
    expect(fetchMock).toHaveBeenCalledWith('/api/employees/3/competencies')

    // Rows are sorted by name. Competency and renewal counts include
    // competencies no qualification requires, and competencies the
    // employee doesn't have are not counted.
    const [, anna, mika] = screen.getAllByRole('row')
    expect(getCellTexts(anna)).toEqual(['Anna Korhonen', '2', '2', '5', '0'])
    expect(getCellTexts(mika)).toEqual(['Mika Niemi', '1', '3', '4', '2'])
  })

  it("shows the unit's supervisors", async () => {
    mockFetch(fakeResponses)

    renderWithRouter(<SupervisorMyUnit />, '/supervisor/my-unit', 7)

    const supervisors = within(
      screen.getByRole('region', { name: 'Unit supervisors' })
    )
    await waitFor(() => {
      expect(
        supervisors.getAllByRole('listitem').map((item) => item.textContent)
      ).toEqual(['Matti Mattinen', 'Joe Don'])
    })
  })

  it("opens the employee's details from the name", async () => {
    mockFetch(fakeResponses)

    renderWithRouter(<SupervisorMyUnit />, '/supervisor/my-unit', 7)

    fireEvent.click(await screen.findByRole('button', { name: 'Mika Niemi' }))

    const dialog = within(
      await screen.findByRole('dialog', { name: 'Mika Niemi' })
    )
    expect(dialog.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Overview',
      'Qualifications',
      'Competencies',
    ])
    expect(dialog.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true'
    )

    fireEvent.click(dialog.getByRole('tab', { name: 'Competencies' }))
    expect(dialog.getByRole('tab', { name: 'Competencies' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(
      dialog.getByRole('tabpanel', { name: 'Competencies' })
    ).toBeInTheDocument()

    fireEvent.click(dialog.getByRole('button', { name: 'Close' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // The dialog opens on the overview tab again.
    fireEvent.click(screen.getByRole('button', { name: 'Anna Korhonen' }))
    const nextDialog = within(
      await screen.findByRole('dialog', { name: 'Anna Korhonen' })
    )
    expect(nextDialog.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('shows the search bar', () => {
    renderWithRouter(<SupervisorMyUnit />, '/supervisor/my-unit')

    expect(
      screen.getByRole('textbox', { name: 'Search employees' })
    ).toHaveAttribute(
      'placeholder',
      'Search for people, qualifications or competencies'
    )
  })

  // Search matches employee names, qualifications and all the competencies
  // the employee has, also those no qualification requires.
  // A missing competency doesn't match.
  it.each([
    { search: 'korhonen', expected: ['Anna Korhonen'] },
    { search: '  MIKA ', expected: ['Mika Niemi'] },
    { search: 'Qualification 4', expected: ['Mika Niemi'] },
    { search: 'qualification 1', expected: ['Anna Korhonen', 'Mika Niemi'] },
    { search: 'Competency 2', expected: ['Anna Korhonen'] },
    { search: 'Competency 8', expected: ['Mika Niemi'] },
    { search: 'Competency 6', expected: ['Anna Korhonen'] },
    { search: 'Competency 9', expected: ['Mika Niemi'] },
    { search: 'Competency 7', expected: [] },
    { search: '', expected: ['Anna Korhonen', 'Mika Niemi'] },
  ])('filters employees by $search', async ({ search, expected }) => {
    mockFetch(fakeResponses)

    renderWithRouter(<SupervisorMyUnit />, '/supervisor/my-unit', 7)

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(3)
    })

    fireEvent.change(
      screen.getByRole('textbox', { name: 'Search employees' }),
      { target: { value: search } }
    )

    await waitFor(() => {
      const names = screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => getCellTexts(row)[0])
      expect(names).toEqual(expected)
    })
  })

  it('shows an error when the unit cannot be found', async () => {
    mockFetch({})

    renderWithRouter(<SupervisorMyUnit />, '/supervisor/my-unit', 99)

    expect(
      await screen.findByText('Unit or employee data could not be found')
    ).toBeInTheDocument()
  })
})
