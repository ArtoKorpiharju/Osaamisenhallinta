import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import SupervisorOverview from '../src/pages/supervisor/Overview'
import UpcomingExpirationsTable, {
  type ExpirationItem,
} from '../src/components/UpcomingExpirationsTable'

// Render page at the given path with Router
function renderWithRouter(page: ReactElement, path: string) {
  return render(<MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>)
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

describe('SupervisorOverview', () => {
  it('shows the stats and upcoming expirations', () => {
    renderWithRouter(<SupervisorOverview />, '/supervisor/overview')

    expect(
      screen.getByRole('heading', { name: 'Supervisor Overview' })
    ).toBeInTheDocument()

    // Summary cards rendered
    expect(screen.getByText('Expired competencies')).toBeInTheDocument()
    expect(screen.getByText('Expiring within 90 days')).toBeInTheDocument()
    expect(screen.getByText('Missing renewals')).toBeInTheDocument()
    expect(screen.getByText('Planned renewals')).toBeInTheDocument()

    // Upcoming expirations table
    expect(
      screen.getByRole('heading', { name: 'Upcoming Expirations' })
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
