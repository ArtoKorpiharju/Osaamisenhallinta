import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'

// Checks the default vite page. Remember to update this!
describe('App', () => {
  it('default Vite page renders', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /get started/i })
    ).toBeInTheDocument()
  })
})
