import { describe, expect, test } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from '../router'
import { createTestQueryClient } from '../test/setup'

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  )
}

describe('Home', () => {
  test('renders welcome message', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })
    expect(screen.getByText('Welcome to F1 2024 Browser')).toBeDefined()
  })

  test('renders navigation cards', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    // Check card titles using test IDs
    expect(screen.getByTestId('2024 results-card-title')).toHaveTextContent(
      '2024 Results',
    )
    expect(screen.getByTestId('circuits-card-title')).toHaveTextContent(
      'Circuits',
    )
    expect(screen.getByTestId('2024 drivers-card-title')).toHaveTextContent(
      '2024 Drivers',
    )
    expect(
      screen.getByTestId('2024 constructors-card-title'),
    ).toHaveTextContent('2024 Constructors')

    // Check card descriptions
    expect(
      screen.getByText('View race results and standings for the 2024 season'),
    ).toBeDefined()
    expect(
      screen.getByText('Browse all Formula 1 circuits and their details'),
    ).toBeDefined()
    expect(
      screen.getByText('View current Formula 1 drivers and their information'),
    ).toBeDefined()
    expect(
      screen.getByText('Explore Formula 1 teams and their details'),
    ).toBeDefined()
  })
})
