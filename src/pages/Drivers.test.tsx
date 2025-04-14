import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from '../router'
import { f1Api } from '../services/f1Api'
import { createTestQueryClient } from '../test/setup'

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getDrivers: vi.fn(),
  },
}))

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  )
}

describe('Drivers', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock response for all tests
    const defaultMockDrivers = {
      MRData: {
        DriverTable: {
          Drivers: [],
        },
      },
    }

    vi.mocked(f1Api.getDrivers).mockResolvedValue(defaultMockDrivers)
  })

  test('renders page title', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const driversLink = screen.getByRole('link', { name: 'Drivers' })
    await act(async () => {
      fireEvent.click(driversLink)
    })

    expect(await screen.findByText('F1 Drivers 2024')).toBeDefined()
  })

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getDrivers).mockImplementation(() => new Promise(() => {}))

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const driversLink = screen.getByRole('link', { name: 'Drivers' })
    await act(async () => {
      fireEvent.click(driversLink)
    })

    expect(await screen.findByText('Loading...')).toBeDefined()
  })

  test('renders driver list when data is loaded', async () => {
    // Mock the API response
    const mockDrivers = {
      MRData: {
        DriverTable: {
          Drivers: [
            {
              driverId: 'max_verstappen',
              permanentNumber: '1',
              code: 'VER',
              url: 'http://example.com/verstappen',
              givenName: 'Max',
              familyName: 'Verstappen',
              dateOfBirth: '1997-09-30',
              nationality: 'Dutch',
            },
          ],
        },
      },
    }

    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockDrivers)

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const driversLink = screen.getByRole('link', { name: 'Drivers' })
    await act(async () => {
      fireEvent.click(driversLink)
    })

    // Wait for driver data to load
    const driverName = await screen.findByText('Max Verstappen')
    expect(driverName).toBeDefined()

    // Check driver details
    expect(screen.getByText(/Dutch/)).toBeDefined()
    expect(screen.getByText(/9\/30\/1997/)).toBeDefined()
    expect(screen.getByText(/VER/)).toBeDefined()
  })

  test('handles empty driver list', async () => {
    // Mock empty API response
    const mockDrivers = {
      MRData: {
        DriverTable: {
          Drivers: [],
        },
      },
    }

    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockDrivers)

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const driversLink = screen.getByRole('link', { name: 'Drivers' })
    await act(async () => {
      fireEvent.click(driversLink)
    })

    // Wait for loading to finish
    const title = await screen.findByText('F1 Drivers 2024')
    expect(title).toBeDefined()

    // Verify no drivers are rendered
    expect(screen.queryByText(/Verstappen/)).toBeNull()
  })
})
