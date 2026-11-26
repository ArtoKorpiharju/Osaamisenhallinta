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
import SupervisorOverview from '../src/pages/supervisor/Overview'
import UpcomingExpirationsTable, {
  type ExpirationItem,
} from '../src/components/SupervisorOverview/InvalidAndExpiringCompetenciesTable'

// Render page at the given path with Router
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

// Replace fetch with a mock that returns the given response.
function mockFetch(response: { ok: boolean; status?: number; data?: unknown }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? 200,
    json: () => Promise.resolve(response.data),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// Get the summary card with the given title.
function getSummaryCard(title: string) {
  const card = screen.getByRole('heading', { name: title }).closest('article')
  if (!card) throw new Error(`Summary card ${title} not found`)
  return card
}

// Fake table content
const fakeExpirations: ExpirationItem[] = [
  {
    id: 1,
    employee: 'Tere Tellava',
    competency: 'Truck training',
    expires: '15.11.2026',
    urgencyDays: 13,
    renewalPlan: null,
  },
  {
    id: 2,
    employee: 'Pena Penava',
    competency: 'Forklift training',
    expires: '10.01.2027',
    urgencyDays: 70,
    renewalPlan: '21.12.2026',
  },
]

// Fake API response, relative to 15.11.2026
const fakeExpiringCompetencies = [
  {
    employeeId: 3,
    employeeFirstName: 'Mika',
    employeeLastName: 'Niemi',
    qualificationId: 1,
    qualificationName: 'Warehouse Operator',
    competencyId: 1,
    competencyName: 'Fire Safety Training',
    expirationDate: '2026-10-16',
    competencyStatus: 'EXPIRED',
    renewalDate: null,
  },
  {
    employeeId: 1,
    employeeFirstName: 'John',
    employeeLastName: 'Employee',
    qualificationId: 1,
    qualificationName: 'Warehouse Operator',
    competencyId: 1,
    competencyName: 'Fire Safety Training',
    expirationDate: '2026-12-15',
    competencyStatus: 'EXPIRING_SOON',
    renewalDate: '2026-11-25',
  },
  {
    employeeId: 1,
    employeeFirstName: 'John',
    employeeLastName: 'Employee',
    qualificationId: 4,
    qualificationName: 'Logistics Coordinator',
    competencyId: 8,
    competencyName: 'Incident Reporting',
    expirationDate: null,
    competencyStatus: 'MISSING',
    renewalDate: null,
  },
  {
    employeeId: 2,
    employeeFirstName: 'Anna',
    employeeLastName: 'Korhonen',
    qualificationId: 1,
    qualificationName: 'Warehouse Operator',
    competencyId: 1,
    competencyName: 'Fire Safety Training',
    expirationDate: '2026-12-15',
    competencyStatus: 'EXPIRING_SOON',
    renewalDate: null,
  },
  // Same employee competency in another critical qualification
  {
    employeeId: 2,
    employeeFirstName: 'Anna',
    employeeLastName: 'Korhonen',
    qualificationId: 5,
    qualificationName: 'Safety Officer',
    competencyId: 1,
    competencyName: 'Fire Safety Training',
    expirationDate: '2026-12-15',
    competencyStatus: 'EXPIRING_SOON',
    renewalDate: null,
  },
  {
    employeeId: 3,
    employeeFirstName: 'Mika',
    employeeLastName: 'Niemi',
    qualificationId: 1,
    qualificationName: 'Warehouse Operator',
    competencyId: 4,
    competencyName: 'Forklift License',
    expirationDate: '2026-12-01',
    competencyStatus: 'EXPIRING_SOON',
    renewalDate: '2026-11-27',
  },
]

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('SupervisorOverview', () => {
  it('shows the stats and upcoming expirations', () => {
    renderWithRouter(<SupervisorOverview />, '/supervisor/overview')

    expect(
      screen.getByRole('heading', { name: 'Supervisor Overview' })
    ).toBeInTheDocument()

    // Summary cards rendered
    expect(screen.getByText('Invalid competencies')).toBeInTheDocument()
    expect(
      screen.getByText('Competencies expiring within 90 days')
    ).toBeInTheDocument()
    expect(screen.getByText('Require action')).toBeInTheDocument()
    expect(screen.getByText('Planned renewals')).toBeInTheDocument()

    // Upcoming expirations table
    expect(
      screen.getByRole('heading', {
        name: 'Invalid or soon-expiring competencies',
      })
    ).toBeInTheDocument()
  })

  // Test the page with data from the unit endpoint
  it("shows the summary and expirations of the supervisor's unit", async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 15, 12))
    const fetchMock = mockFetch({ ok: true, data: fakeExpiringCompetencies })

    renderWithRouter(<SupervisorOverview />, '/supervisor/overview', 7)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/units/7/at-risk-critical-qualification-items'
    )
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(5)
    })

    // Summary counts each employee competency once
    expect(within(getSummaryCard('Invalid')).getByText('2')).toBeInTheDocument()
    expect(
      within(getSummaryCard('Expiring soon')).getByText('3')
    ).toBeInTheDocument()
    expect(
      within(getSummaryCard('Require action')).getByText('2')
    ).toBeInTheDocument()
    expect(
      within(getSummaryCard('Planned renewals')).getByText('2')
    ).toBeInTheDocument()

    // Missing competencies have no expiration date, so they are not in the table.
    // Rows are sorted by expiration date, then by employee name.
    const [, mikaFire, mikaForklift, john, anna] = screen.getAllByRole('row')

    expect(within(mikaFire).getByText('Mika Niemi')).toBeInTheDocument()
    expect(
      within(mikaFire).getByText('Fire Safety Training')
    ).toBeInTheDocument()
    expect(within(mikaFire).getByText('16.10.2026')).toBeInTheDocument()
    // Already expired, so the days left are shown as 0 instead of negative.
    expect(within(mikaFire).getByText('0d')).toBeInTheDocument()
    expect(within(mikaFire).getByText('Not planned')).toBeInTheDocument()

    expect(
      within(mikaForklift).getByText('Forklift License')
    ).toBeInTheDocument()
    expect(within(mikaForklift).getByText('01.12.2026')).toBeInTheDocument()
    expect(within(mikaForklift).getByText('16d')).toBeInTheDocument()
    expect(within(mikaForklift).getByText('27.11.2026')).toBeInTheDocument()

    expect(within(john).getByText('John Employee')).toBeInTheDocument()
    expect(within(john).getByText('30d')).toBeInTheDocument()
    expect(within(john).getByText('25.11.2026')).toBeInTheDocument()

    expect(within(anna).getByText('Anna Korhonen')).toBeInTheDocument()
    expect(within(anna).getByText('15.12.2026')).toBeInTheDocument()
    expect(within(anna).getByText('Not planned')).toBeInTheDocument()
  })

  it('shows an error when the unit cannot be found', async () => {
    mockFetch({ ok: false, status: 404 })

    renderWithRouter(<SupervisorOverview />, '/supervisor/overview', 99)

    expect(
      await screen.findByText('Supervised unit could not be found')
    ).toBeInTheDocument()
  })

  // Test expirations table
  it('renders fake rows in the upcoming expirations table', () => {
    const onItemClick = vi.fn()
    render(
      <UpcomingExpirationsTable
        items={fakeExpirations}
        onItemClick={onItemClick}
      />
    )

    // Test table content
    const [, first, second] = screen.getAllByRole('row')

    expect(within(first).getByText('Tere Tellava')).toBeInTheDocument()
    expect(within(first).getByText('Truck training')).toBeInTheDocument()
    expect(within(first).getByText('15.11.2026')).toBeInTheDocument()
    expect(within(first).getByText('13d')).toBeInTheDocument()
    expect(within(first).getByText('Not planned')).toBeInTheDocument()

    expect(within(second).getByText('Pena Penava')).toBeInTheDocument()
    expect(within(second).getByText('Forklift training')).toBeInTheDocument()
    expect(within(second).getByText('10.01.2027')).toBeInTheDocument()
    expect(within(second).getByText('70d')).toBeInTheDocument()
    expect(within(second).getByText('21.12.2026')).toBeInTheDocument()

    // Test clicking
    fireEvent.click(within(second).getByText('Pena Penava'))
    expect(onItemClick).toHaveBeenCalledWith(fakeExpirations[1])
  })
})
