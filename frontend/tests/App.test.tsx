import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'

describe('App', () => {
  it('redirects the root route to the employee overview', async () => {
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: /employee overview/i })
    ).toBeInTheDocument()
  })
})
