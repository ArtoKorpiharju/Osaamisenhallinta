import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminOverview from '../src/pages/admin/Overview'

describe('AdminOverview', () => {
  it('shows the admin center cards and quick actions', () => {
    render(<AdminOverview />)

    expect(screen.getByText('Admin Center')).toBeInTheDocument()

    // Summary cards rendered
    for (const card of [
      'Certificates',
      'Skills',
      'Trainings',
      'Licenses',
      'Qualifications',
    ]) {
      expect(
        screen.getByText(`Total ${card.toLowerCase()}`)
      ).toBeInTheDocument()
    }

    // Quick action buttons rendered
    expect(
      screen.getByRole('button', { name: 'Add competence' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add qualification' })
    ).toBeInTheDocument()
  })
})
