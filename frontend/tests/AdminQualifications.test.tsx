import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'

import AdminQualifications from '../src/pages/admin/Qualifications'

vi.mock('../src/services/adminQualifications', () => ({
  fetchAdminQualifications: vi.fn().mockResolvedValue([
    {
      qualificationId: 1,
      qualificationName: 'NDT Inspector',
      requiredCompetencies: [],
    },
    {
      qualificationId: 2,
      qualificationName: 'Safety Supervisor',
      requiredCompetencies: [],
    },
  ]),
}))

it('filters qualifications by name without changing the total count', async () => {
  render(
    <MemoryRouter>
      <AdminQualifications />
    </MemoryRouter>,
  )

  expect(await screen.findByText('NDT Inspector')).toBeInTheDocument()
  expect(screen.getByText('Safety Supervisor')).toBeInTheDocument()

  fireEvent.change(screen.getByRole('searchbox'), {
    target: { value: 'safety' },
  })

  expect(screen.queryByText('NDT Inspector')).not.toBeInTheDocument()
  expect(screen.getByText('Safety Supervisor')).toBeInTheDocument()
  expect(screen.getByText('Total qualifications: 2')).toBeInTheDocument()
})